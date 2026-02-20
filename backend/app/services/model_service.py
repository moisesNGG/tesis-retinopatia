import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import io
import os
import gc
import threading
import traceback

# ---------------------------------------------------------------------------
# Constantes
# ---------------------------------------------------------------------------
CLASS_LABELS = [
    'Sin Retinopatia',
    'Retinopatia Diabetica Leve',
    'Retinopatia Diabetica Moderada',
    'Retinopatia Diabetica Severa',
    'Retinopatia Diabetica Proliferativa',
]

SEVERITY_LEVELS = ['none', 'mild', 'moderate', 'severe', 'proliferative']

NUM_CLASSES = 5

# ---------------------------------------------------------------------------
# External Attention (modulo compartido por DenseNet, EfficientNet y ResNet)
# ---------------------------------------------------------------------------
class ExternalAttention(nn.Module):
    def __init__(self, dim, num_heads=8, dim_head=64, dropout=0.):
        super().__init__()
        inner_dim = dim_head * num_heads
        self.num_heads = num_heads
        self.scale = dim_head ** -0.5

        self.to_qkv = nn.Linear(dim, inner_dim * 3, bias=False)
        self.to_out = nn.Sequential(
            nn.Linear(inner_dim, dim),
            nn.Dropout(dropout),
        )

        self.mem_k = nn.Parameter(torch.randn(num_heads, dim_head, dim_head))
        self.mem_v = nn.Parameter(torch.randn(num_heads, dim_head, dim_head))

    def forward(self, x):
        b, n, _, h = *x.shape, self.num_heads
        qkv = self.to_qkv(x).chunk(3, dim=-1)
        q, k, v = map(lambda t: t.reshape(b, n, h, -1).transpose(1, 2), qkv)

        attn = torch.einsum('bhnd,hdk->bhnk', q, self.mem_k) * self.scale
        attn = attn.softmax(dim=-1)

        out = torch.einsum('bhnk,hkd->bhnd', attn, self.mem_v)
        out = out.transpose(1, 2).reshape(b, n, -1)

        return self.to_out(out)


# ---------------------------------------------------------------------------
# DenseNet121 + 6 Conv Layers + External Attention
# ---------------------------------------------------------------------------
class DenseNet121WithExternalAttention(nn.Module):
    def __init__(self, num_classes=NUM_CLASSES, pretrained=False):
        super().__init__()
        densenet = models.densenet121(weights=None)
        self.features = densenet.features  # output: 1024 channels

        self.extra_conv1 = nn.Sequential(nn.Conv2d(1024, 512, 3, padding=1), nn.BatchNorm2d(512), nn.ReLU(inplace=True), nn.Dropout2d(0.3))
        self.extra_conv2 = nn.Sequential(nn.Conv2d(512, 384, 3, padding=1), nn.BatchNorm2d(384), nn.ReLU(inplace=True), nn.Dropout2d(0.3))
        self.extra_conv3 = nn.Sequential(nn.Conv2d(384, 320, 3, padding=1), nn.BatchNorm2d(320), nn.ReLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv4 = nn.Sequential(nn.Conv2d(320, 256, 3, padding=1), nn.BatchNorm2d(256), nn.ReLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv5 = nn.Sequential(nn.Conv2d(256, 256, 3, padding=1), nn.BatchNorm2d(256), nn.ReLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv6 = nn.Sequential(nn.Conv2d(256, 256, 3, padding=1), nn.BatchNorm2d(256), nn.ReLU(inplace=True))

        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        self.external_attention = ExternalAttention(dim=256, num_heads=8, dim_head=32, dropout=0.1)
        self.classifier = nn.Sequential(nn.Linear(256, 512), nn.ReLU(inplace=True), nn.Dropout(0.5), nn.Linear(512, num_classes))

    def forward(self, x):
        x = self.features(x)
        x = self.extra_conv1(x)
        x = self.extra_conv2(x)
        x = self.extra_conv3(x)
        x = self.extra_conv4(x)
        x = self.extra_conv5(x)
        x = self.extra_conv6(x)
        x = self.gap(x).flatten(1)
        x = x.unsqueeze(1)
        x = self.external_attention(x)
        x = x.squeeze(1)
        return self.classifier(x)


# ---------------------------------------------------------------------------
# EfficientNet-B0 + 6 Conv Layers + External Attention (SiLU activation)
# ---------------------------------------------------------------------------
class EfficientNetB0WithExternalAttention(nn.Module):
    def __init__(self, num_classes=NUM_CLASSES, pretrained=False):
        super().__init__()
        efficientnet = models.efficientnet_b0(weights=None)
        self.features = efficientnet.features  # output: 1280 channels

        self.extra_conv1 = nn.Sequential(nn.Conv2d(1280, 640, 3, padding=1), nn.BatchNorm2d(640), nn.SiLU(inplace=True), nn.Dropout2d(0.3))
        self.extra_conv2 = nn.Sequential(nn.Conv2d(640, 448, 3, padding=1), nn.BatchNorm2d(448), nn.SiLU(inplace=True), nn.Dropout2d(0.3))
        self.extra_conv3 = nn.Sequential(nn.Conv2d(448, 320, 3, padding=1), nn.BatchNorm2d(320), nn.SiLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv4 = nn.Sequential(nn.Conv2d(320, 256, 3, padding=1), nn.BatchNorm2d(256), nn.SiLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv5 = nn.Sequential(nn.Conv2d(256, 256, 3, padding=1), nn.BatchNorm2d(256), nn.SiLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv6 = nn.Sequential(nn.Conv2d(256, 256, 3, padding=1), nn.BatchNorm2d(256), nn.SiLU(inplace=True))

        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        self.external_attention = ExternalAttention(dim=256, num_heads=8, dim_head=32, dropout=0.1)
        self.classifier = nn.Sequential(nn.Linear(256, 512), nn.SiLU(inplace=True), nn.Dropout(0.5), nn.Linear(512, num_classes))

    def forward(self, x):
        x = self.features(x)
        x = self.extra_conv1(x)
        x = self.extra_conv2(x)
        x = self.extra_conv3(x)
        x = self.extra_conv4(x)
        x = self.extra_conv5(x)
        x = self.extra_conv6(x)
        x = self.gap(x).flatten(1)
        x = x.unsqueeze(1)
        x = self.external_attention(x)
        x = x.squeeze(1)
        return self.classifier(x)


# ---------------------------------------------------------------------------
# ResNet50 + 5 Conv Layers + External Attention
# ---------------------------------------------------------------------------
class ResNet50WithExternalAttention(nn.Module):
    def __init__(self, num_classes=NUM_CLASSES, pretrained=False):
        super().__init__()
        resnet = models.resnet50(weights=None)
        self.features = nn.Sequential(*list(resnet.children())[:-2])  # output: 2048 channels

        self.extra_conv1 = nn.Sequential(nn.Conv2d(2048, 1024, 3, padding=1), nn.BatchNorm2d(1024), nn.ReLU(inplace=True), nn.Dropout2d(0.3))
        self.extra_conv2 = nn.Sequential(nn.Conv2d(1024, 512, 3, padding=1), nn.BatchNorm2d(512), nn.ReLU(inplace=True), nn.Dropout2d(0.3))
        self.extra_conv3 = nn.Sequential(nn.Conv2d(512, 512, 3, padding=1), nn.BatchNorm2d(512), nn.ReLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv4 = nn.Sequential(nn.Conv2d(512, 256, 3, padding=1), nn.BatchNorm2d(256), nn.ReLU(inplace=True), nn.Dropout2d(0.2))
        self.extra_conv5 = nn.Sequential(nn.Conv2d(256, 256, 3, padding=1), nn.BatchNorm2d(256), nn.ReLU(inplace=True))

        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        self.external_attention = ExternalAttention(dim=256, num_heads=8, dim_head=32, dropout=0.1)
        self.classifier = nn.Sequential(nn.Linear(256, 512), nn.ReLU(inplace=True), nn.Dropout(0.5), nn.Linear(512, num_classes))

    def forward(self, x):
        x = self.features(x)
        x = self.extra_conv1(x)
        x = self.extra_conv2(x)
        x = self.extra_conv3(x)
        x = self.extra_conv4(x)
        x = self.extra_conv5(x)
        x = self.gap(x).flatten(1)
        x = x.unsqueeze(1)
        x = self.external_attention(x)
        x = x.squeeze(1)
        return self.classifier(x)


# ---------------------------------------------------------------------------
# Preprocessing
# ---------------------------------------------------------------------------
_IMAGENET_MEAN = [0.485, 0.456, 0.406]
_IMAGENET_STD = [0.229, 0.224, 0.225]

_inference_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=_IMAGENET_MEAN, std=_IMAGENET_STD),
])


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    return _inference_transform(img).unsqueeze(0)  # [1, 3, 224, 224]


# ---------------------------------------------------------------------------
# ModelService singleton
# ---------------------------------------------------------------------------
class ModelService:
    def __init__(self):
        self.models: dict = {}
        self.loaded = False
        self.loading = False
        self.models_loaded_count = 0
        self.device = torch.device('cpu')

    def load_all_models(self, models_dir: str):
        """Carga modelos en un thread de fondo para no bloquear el startup del servidor."""
        self.loading = True
        thread = threading.Thread(target=self._load_models_sync, args=(models_dir,), daemon=True)
        thread.start()

    def _load_models_sync(self, models_dir: str):
        print(f"[ModelService] Cargando modelos en background desde {models_dir} ...")

        model_configs = [
            {
                'name': 'DenseNet121 + EA',
                'class': DenseNet121WithExternalAttention,
                'path': os.path.join(models_dir, 'densenet121_ea', 'best_model.pth'),
                'checkpoint_key': 'model_state_dict',
            },
            {
                'name': 'EfficientNet-B0 + EA',
                'class': EfficientNetB0WithExternalAttention,
                'path': os.path.join(models_dir, 'efficientnet_b0_ea', 'best_model.pth'),
                'checkpoint_key': 'model_state_dict',
            },
            {
                'name': 'ResNet50 + EA',
                'class': ResNet50WithExternalAttention,
                'path': os.path.join(models_dir, 'resnet50_ea', 'best_model.pth'),
                'checkpoint_key': 'model_state_dict',
            },
            {
                'name': 'ViT-B/16',
                'path': os.path.join(models_dir, 'vit_b16', 'vit_b16_best.pt'),
                'checkpoint_key': None,  # state_dict directo
            },
            {
                'name': 'YOLOv8x-cls',
                'path': os.path.join(models_dir, 'yolov8x_cls', 'best.pt'),
                'checkpoint_key': 'yolo',
            },
        ]

        for cfg in model_configs:
            try:
                if not os.path.exists(cfg['path']):
                    print(f"  [WARN] No se encontro {cfg['path']}, saltando {cfg['name']}")
                    continue

                if cfg['checkpoint_key'] == 'yolo':
                    self._load_yolo(cfg)
                elif cfg['name'] == 'ViT-B/16':
                    self._load_vit(cfg)
                else:
                    self._load_pytorch(cfg)

                self.models_loaded_count = len(self.models)
                print(f"  [OK] {cfg['name']} cargado ({self.models_loaded_count}/5)")
                # Liberar memoria entre cargas
                gc.collect()
            except Exception:
                print(f"  [ERROR] Fallo al cargar {cfg['name']}:")
                traceback.print_exc()
                gc.collect()

        self.loaded = len(self.models) > 0
        self.loading = False
        print(f"[ModelService] {len(self.models)} modelos cargados correctamente")

    def _load_pytorch(self, cfg: dict):
        model = cfg['class'](num_classes=NUM_CLASSES, pretrained=False)
        checkpoint = torch.load(cfg['path'], map_location=self.device, weights_only=False)
        state_dict = checkpoint[cfg['checkpoint_key']]
        model.load_state_dict(state_dict)
        del checkpoint, state_dict
        gc.collect()
        model.to(self.device)
        model.eval()
        self.models[cfg['name']] = {'model': model, 'type': 'pytorch'}

    def _load_vit(self, cfg: dict):
        from torchvision.models import vit_b_16
        model = vit_b_16(weights=None)
        model.heads.head = nn.Linear(model.heads.head.in_features, NUM_CLASSES)
        state_dict = torch.load(cfg['path'], map_location=self.device, weights_only=False)
        model.load_state_dict(state_dict)
        del state_dict
        gc.collect()
        model.to(self.device)
        model.eval()
        self.models[cfg['name']] = {'model': model, 'type': 'pytorch'}

    def _load_yolo(self, cfg: dict):
        from ultralytics import YOLO
        model = YOLO(cfg['path'])
        self.models[cfg['name']] = {'model': model, 'type': 'yolo'}

    def predict_all(self, image_bytes: bytes) -> list[dict]:
        results = []
        input_tensor = preprocess_image(image_bytes)
        pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        for name, info in self.models.items():
            try:
                if info['type'] == 'pytorch':
                    result = self._predict_pytorch(info['model'], input_tensor)
                else:
                    result = self._predict_yolo(info['model'], pil_image)

                result['model_name'] = name
                results.append(result)
            except Exception:
                print(f"  [ERROR] Prediccion fallo para {name}:")
                traceback.print_exc()
                results.append({
                    'model_name': name,
                    'prediction': 'Error',
                    'confidence': 0.0,
                    'severity': 'none',
                    'probabilities': [0.0] * NUM_CLASSES,
                })

        return results

    def _predict_pytorch(self, model: nn.Module, input_tensor: torch.Tensor) -> dict:
        with torch.no_grad():
            logits = model(input_tensor.to(self.device))
            probs = F.softmax(logits, dim=1).squeeze(0)
            confidence, class_idx = probs.max(0)

        idx = class_idx.item()
        return {
            'prediction': CLASS_LABELS[idx],
            'confidence': round(confidence.item(), 4),
            'severity': SEVERITY_LEVELS[idx],
            'probabilities': [round(p.item(), 4) for p in probs],
        }

    def _predict_yolo(self, model, pil_image: Image.Image) -> dict:
        results = model.predict(pil_image, imgsz=224, verbose=False)
        probs = results[0].probs

        idx = probs.top1
        confidence = probs.top1conf.item()
        all_probs = probs.data.tolist()

        return {
            'prediction': CLASS_LABELS[idx],
            'confidence': round(confidence, 4),
            'severity': SEVERITY_LEVELS[idx],
            'probabilities': [round(p, 4) for p in all_probs],
        }


# Singleton
model_service = ModelService()
