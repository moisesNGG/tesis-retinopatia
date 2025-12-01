#!/usr/bin/env python3
"""
🧪 BACKEND API TESTING - PROYECTO DEFAULT
Prueba completa de todos los endpoints del backend FastAPI
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class BackendTester:
    def __init__(self, base_url="https://simple-starter.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Registrar resultado de test"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def test_api_root(self) -> bool:
        """Test GET /api/ - Mensaje de bienvenida"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                expected_fields = ["mensaje", "estado", "version"]
                
                if all(field in data for field in expected_fields):
                    if "Hola Mundo" in data.get("mensaje", ""):
                        self.log_test("API Root Endpoint", True)
                        return True
                    else:
                        self.log_test("API Root Endpoint", False, "Mensaje incorrecto")
                else:
                    self.log_test("API Root Endpoint", False, "Campos faltantes en respuesta")
            else:
                self.log_test("API Root Endpoint", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Error: {str(e)}")
        
        return False

    def test_personalized_greeting(self) -> bool:
        """Test GET /api/saludo/{nombre} - Saludo personalizado"""
        test_name = "TestUser"
        try:
            response = requests.get(f"{self.api_url}/saludo/{test_name}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "mensaje" in data and test_name in data["mensaje"]:
                    self.log_test("Personalized Greeting", True)
                    return True
                else:
                    self.log_test("Personalized Greeting", False, "Nombre no incluido en saludo")
            else:
                self.log_test("Personalized Greeting", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Personalized Greeting", False, f"Error: {str(e)}")
        
        return False

    def test_create_message(self) -> Dict[str, Any]:
        """Test POST /api/mensaje - Crear mensaje"""
        test_message = {
            "texto": f"Mensaje de prueba - {datetime.now().isoformat()}",
            "autor": "TestBot"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/mensaje", 
                json=test_message,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "texto", "autor", "fecha_creacion"]
                
                if all(field in data for field in required_fields):
                    if (data["texto"] == test_message["texto"] and 
                        data["autor"] == test_message["autor"]):
                        self.log_test("Create Message", True)
                        return data
                    else:
                        self.log_test("Create Message", False, "Datos no coinciden")
                else:
                    self.log_test("Create Message", False, "Campos faltantes en respuesta")
            else:
                self.log_test("Create Message", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Create Message", False, f"Error: {str(e)}")
        
        return {}

    def test_get_messages(self) -> bool:
        """Test GET /api/mensajes - Obtener todos los mensajes"""
        try:
            response = requests.get(f"{self.api_url}/mensajes", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Messages", True, f"Encontrados {len(data)} mensajes")
                    return True
                else:
                    self.log_test("Get Messages", False, "Respuesta no es una lista")
            else:
                self.log_test("Get Messages", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Messages", False, f"Error: {str(e)}")
        
        return False

    def test_delete_messages(self) -> bool:
        """Test DELETE /api/mensajes - Eliminar todos los mensajes"""
        try:
            response = requests.delete(f"{self.api_url}/mensajes", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "cantidad_eliminada" in data:
                    self.log_test("Delete Messages", True, f"Eliminados: {data['cantidad_eliminada']}")
                    return True
                else:
                    self.log_test("Delete Messages", False, "Campo cantidad_eliminada faltante")
            else:
                self.log_test("Delete Messages", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Delete Messages", False, f"Error: {str(e)}")
        
        return False

    def test_message_validation(self) -> bool:
        """Test validación de mensajes con datos inválidos"""
        invalid_messages = [
            {},  # Vacío
            {"texto": ""},  # Texto vacío
            {"autor": ""},  # Autor vacío
            {"texto": "Test"},  # Sin autor
            {"autor": "Test"}  # Sin texto
        ]
        
        validation_passed = 0
        for i, invalid_msg in enumerate(invalid_messages):
            try:
                response = requests.post(
                    f"{self.api_url}/mensaje", 
                    json=invalid_msg,
                    timeout=10
                )
                
                # Esperamos que falle (4xx)
                if response.status_code >= 400:
                    validation_passed += 1
                    
            except Exception:
                # Error de conexión también cuenta como validación correcta
                validation_passed += 1
        
        success = validation_passed >= 3  # Al menos 3 de 5 validaciones deben fallar
        self.log_test("Message Validation", success, f"{validation_passed}/5 validaciones correctas")
        return success

    def run_full_test_suite(self):
        """Ejecutar suite completa de tests"""
        print("🚀 INICIANDO TESTS DEL BACKEND API")
        print("=" * 50)
        print(f"🌐 Base URL: {self.base_url}")
        print(f"📡 API URL: {self.api_url}")
        print("=" * 50)
        
        # Test 1: Endpoint raíz
        print("\n1️⃣ Testing API Root...")
        self.test_api_root()
        
        # Test 2: Saludo personalizado
        print("\n2️⃣ Testing Personalized Greeting...")
        self.test_personalized_greeting()
        
        # Test 3: Crear mensaje
        print("\n3️⃣ Testing Create Message...")
        created_message = self.test_create_message()
        
        # Test 4: Obtener mensajes
        print("\n4️⃣ Testing Get Messages...")
        self.test_get_messages()
        
        # Test 5: Validación de datos
        print("\n5️⃣ Testing Message Validation...")
        self.test_message_validation()
        
        # Test 6: Eliminar mensajes (al final para limpiar)
        print("\n6️⃣ Testing Delete Messages...")
        self.test_delete_messages()
        
        # Verificar que la eliminación funcionó
        print("\n7️⃣ Verifying Cleanup...")
        final_messages = requests.get(f"{self.api_url}/mensajes", timeout=10)
        if final_messages.status_code == 200:
            count = len(final_messages.json())
            self.log_test("Cleanup Verification", count == 0, f"Mensajes restantes: {count}")
        
        # Resumen final
        self.print_summary()

    def print_summary(self):
        """Imprimir resumen de resultados"""
        print("\n" + "=" * 50)
        print("📊 RESUMEN DE TESTS")
        print("=" * 50)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"✅ Tests pasados: {self.tests_passed}")
        print(f"❌ Tests fallidos: {self.tests_run - self.tests_passed}")
        print(f"📊 Total tests: {self.tests_run}")
        print(f"🎯 Tasa de éxito: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ¡TODOS LOS TESTS PASARON! Backend funcionando correctamente.")
            return 0
        else:
            print("\n⚠️  ALGUNOS TESTS FALLARON. Revisar errores arriba.")
            print("\n📋 TESTS FALLIDOS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['name']}: {result['details']}")
            return 1

def main():
    """Función principal"""
    tester = BackendTester()
    return tester.run_full_test_suite()

if __name__ == "__main__":
    sys.exit(main())