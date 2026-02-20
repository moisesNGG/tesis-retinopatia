"""Upload model weights to GitHub Release assets."""
import requests
import os
import sys

TOKEN = open("/tmp/gh_token.txt").read().strip()
REPO = "moisesNGG/tesis-retinopatia"
RELEASE_ID = 288550737

MODELS = [
    ("backend/models_weights/yolov8x_cls/best.pt", "yolov8x_cls_best.pt"),
    ("backend/models_weights/densenet121_ea/best_model.pth", "densenet121_ea_best_model.pth"),
    ("backend/models_weights/efficientnet_b0_ea/best_model.pth", "efficientnet_b0_ea_best_model.pth"),
    ("backend/models_weights/vit_b16/vit_b16_best.pt", "vit_b16_best.pt"),
    ("backend/models_weights/resnet50_ea/best_model.pth", "resnet50_ea_best_model.pth"),
]

headers = {
    "Authorization": f"token {TOKEN}",
    "Content-Type": "application/octet-stream",
}

# Check existing assets first
resp = requests.get(
    f"https://api.github.com/repos/{REPO}/releases/{RELEASE_ID}/assets",
    headers={"Authorization": f"token {TOKEN}"}
)
existing = {a["name"] for a in resp.json()} if resp.status_code == 200 else set()
print(f"Assets existentes: {existing}")

for local_path, asset_name in MODELS:
    if asset_name in existing:
        print(f"  SKIP {asset_name} (ya existe)")
        continue

    size = os.path.getsize(local_path)
    print(f"  Subiendo {asset_name} ({size / 1024 / 1024:.1f} MB)...")

    with open(local_path, "rb") as f:
        resp = requests.post(
            f"https://uploads.github.com/repos/{REPO}/releases/{RELEASE_ID}/assets?name={asset_name}",
            headers=headers,
            data=f,
        )

    if resp.status_code == 201:
        print(f"  OK: {asset_name} subido ({resp.json()['size']} bytes)")
    else:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
        sys.exit(1)

print("\nTodos los modelos subidos exitosamente!")
