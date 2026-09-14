import os
import sys
from pathlib import Path

def convert_pptx_to_pdf(pptx_path, pdf_path):
    """Convert PPTX to PDF using PowerPoint COM automation"""
    try:
        import comtypes.client
    except ImportError:
        print("comtypes no está instalado. Instalando...")
        os.system("pip install comtypes")
        import comtypes.client
    
    try:
        # Initialize PowerPoint
        powerpoint = comtypes.client.CreateObject("PowerPoint.Application")
        powerpoint.Visible = True
        
        # Open the presentation
        deck = powerpoint.Presentations.Open(str(pptx_path.absolute()))
        
        # Save as PDF
        deck.SaveAs(str(pdf_path.absolute()), 32)  # 32 = ppSaveAsPDF
        
        # Close
        deck.Close()
        powerpoint.Quit()
        
        print(f"Convertido exitosamente: {pptx_path.name} -> {pdf_path.name}")
        return True
    except Exception as e:
        print(f"Error al convertir {pptx_path.name}: {e}")
        try:
            powerpoint.Quit()
        except:
            pass
        return False

if __name__ == "__main__":
    # Get all PPTX files in current directory
    current_dir = Path(".")
    pptx_files = list(current_dir.glob("*.pptx"))
    
    if not pptx_files:
        print("No se encontraron archivos PPTX en el directorio actual")
        sys.exit(1)
    
    print(f"Encontrados {len(pptx_files)} archivos PPTX para convertir")
    
    for pptx_file in pptx_files:
        pdf_file = pptx_file.with_suffix('.pdf')
        print(f"Convirtiendo {pptx_file.name}...")
        convert_pptx_to_pdf(pptx_file, pdf_file)
    
    print("Conversión completada")