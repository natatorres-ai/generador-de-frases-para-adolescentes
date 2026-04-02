# Generador de Frases para Adolescentes (18 años)

Sistema en Python para crear frases breves, positivas y universales centradas en la madurez y responsabilidad.

## Instalación
Basta con tener Python instalado. Los archivos necesarios son `generator.py` y `phrases_data.py`.

## Uso

### Modo Manual
Generar 3 frases sobre "Futuro" con tono "Reflexivo":
```bash
py generator.py --tema Futuro --tono Reflexivo --num_frases 3
```

### Modo Automático (Diario)
Garantiza una frase única al día:
```bash
py generator.py --modo automatico
```

### Parámetros
- `--tema`: `Responsabilidad`, `Independencia`, `Futuro`, `Crecimiento` o `SORPRESA` (default).
- `--tono`: `Reflexivo`, `Inspirador`, `Firme`, `Sereno`, `Cercano`.
- `--num_frases`: Cantidad de frases a generar.
- `--modo`: `manual` o `automatico`.

El historial se guarda automáticamente en `historial_frases.json`.