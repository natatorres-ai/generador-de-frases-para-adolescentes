import argparse
import json
import random
import os
from datetime import datetime
from phrases_data import PHRASE_BANK, TEMAS_PREDEFINIDOS, TONOS_PREDEFINIDOS, INTENSIDADES_PREDEFINIDAS

HISTORIAL_FILE = "historial_frases.json"

def cargar_historial():
    """Carga el historial de frases generadas desde un archivo JSON."""
    if not os.path.exists(HISTORIAL_FILE):
        return []
    try:
        with open(HISTORIAL_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def guardar_historial(historial):
    """Guarda el historial actualizado en un archivo JSON."""
    try:
        with open(HISTORIAL_FILE, "w", encoding="utf-8") as f:
            json.dump(historial, f, ensure_ascii=False, indent=4)
        return True
    except IOError:
        return False

def obtener_frase_diaria(historial):
    """Verifica si ya se generó una frase hoy."""
    hoy = datetime.now().strftime("%Y-%m-%d")
    for entrada in historial:
        if entrada.get("fecha") == hoy:
            return entrada.get("frase")
    return None

def validar_frase(frase):
    """Valida que la frase tenga entre 6 y 16 palabras."""
    palabras = frase.split()
    return 6 <= len(palabras) <= 16

def generar_frases(tema, tono, intensidad, num_frases, historial_texto):
    """Genera frases únicas basadas en los parámetos y el historial."""
    # Resolución de "SORPRESA"
    tema_aplicado = tema
    if tema.upper() == "SORPRESA":
        tema_aplicado = random.choice(TEMAS_PREDEFINIDOS)

    # Filtrar frases candidatas
    candidatas = []
    if tema_aplicado in PHRASE_BANK:
        # Intentar coincidencia exacta de tono
        if tono in PHRASE_BANK[tema_aplicado]:
            candidatas = PHRASE_BANK[tema_aplicado][tono]
        else:
            # Fallback: todas las frases del tema
            for t_tono in PHRASE_BANK[tema_aplicado]:
                candidatas.extend(PHRASE_BANK[tema_aplicado][t_tono])
    else:
        # Fallback extremo: cualquier frase de cualquier tema
        for t_tema in PHRASE_BANK:
            for t_tono in PHRASE_BANK[t_tema]:
                candidatas.extend(PHRASE_BANK[t_tema][t_tono])

    # Barajar candidatas
    random.shuffle(candidatas)
    
    seleccionadas = []
    for frase in candidatas:
        if frase not in historial_texto and frase not in seleccionadas:
            if validar_frase(frase):
                seleccionadas.append(frase)
        if len(seleccionadas) >= num_frases:
            break

    return seleccionadas, tema_aplicado

def mostrar_resultado(frases, params, tema_aplicado, historial_actualizado):
    """Muestra las frases y el resumen final."""
    print("\n--- FRASES GENERADAS ---")
    if not frases:
        print("No se encontraron nuevas frases disponibles con los filtros actuales.")
    else:
        for i, frase in enumerate(frases, 1):
            print(f"{i}. {frase}")

    print("\n--- RESUMEN DE OPERACIÓN ---")
    print(f"Tema recibido: {params.tema}")
    print(f"Tema aplicado: {tema_aplicado}")
    print(f"Tono: {params.tono}")
    print(f"Intensidad: {params.intensidad}")
    print(f"Número de frases generadas: {len(frases)}")
    print(f"Número de frases nuevas: {len(frases)}")
    print(f"Estado del historial: {'Actualizado correctamente' if historial_actualizado else 'Error al actualizar'}")
    print("----------------------------\n")

def main():
    parser = argparse.ArgumentParser(description="Generador de frases positivas para adolescentes de 18 años.")
    parser.add_argument("--tema", default="SORPRESA", help="Tema de la frase o 'SORPRESA'")
    parser.add_argument("--tono", default="Inspirador", help="Tono de la frase")
    parser.add_argument("--intensidad", default="Media", choices=INTENSIDADES_PREDEFINIDAS, help="Intensidad")
    parser.add_argument("--contexto", default="", help="Situación opcional")
    parser.add_argument("--idioma", default="Español", help="Idioma de salida")
    parser.add_argument("--num_frases", type=int, default=1, help="Número de frases a generar")
    parser.add_argument("--modo", default="manual", choices=["manual", "automatico"], help="Modo de ejecución")

    args = parser.parse_args()

    historial = cargar_historial()
    historial_texto = [h["frase"] for h in historial]

    # Lógica de modo automático (diario)
    if args.modo == "automatico":
        frase_hoy = obtener_frase_diaria(historial)
        if frase_hoy:
            print(f"Ya se generó una frase para hoy (Modo Automático):\n1. {frase_hoy}")
            # Mostrar resumen breve aunque ya exista
            print("\nResumen: Operación saltada, frase diaria ya existente.")
            return

    # Generación
    frases, tema_aplicado = generar_frases(
        args.tema, args.tono, args.intensidad, args.num_frases, historial_texto
    )

    # Actualizar historial
    nuevos_registros = []
    fecha_hoy = datetime.now().strftime("%Y-%m-%d")
    for f in frases:
        nuevos_registros.append({
            "fecha": fecha_hoy,
            "tema": tema_aplicado,
            "tono": args.tono,
            "frase": f
        })
    
    historial.extend(nuevos_registros)
    historial_actualizado = guardar_historial(historial)

    # Salida
    mostrar_resultado(frases, args, tema_aplicado, historial_actualizado)

if __name__ == "__main__":
    main()
