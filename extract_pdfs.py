import os
import sys

# Check for PDF extraction libraries
try:
    from pypdf import PdfReader
except ImportError:
    try:
        import fitz  # PyMuPDF
        def extract_with_fitz(pdf_path):
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text() + "\n"
            return text
    except ImportError:
        import subprocess
        subprocess.run([sys.executable, "-m", "pip", "install", "pypdf"], check=True)
        from pypdf import PdfReader

pdf_files = [
    "AASISTResearchPaper.pdf",
    "AudioAntiSpoofing.pdf",
    "AudioDeepfakeResearchPaper.pdf",
    "BenchmarkingResearchPaper.pdf",
    "MultiGranularityAttentionFrameworkResearch.pdf",
    "RawBoostResearchPaper.pdf",
    "ScalableAASIST.pdf",
    "voice-cloning-detection-report.pdf"
]

os.makedirs("extracted_research", exist_ok=True)

for pdf_name in pdf_files:
    pdf_path = os.path.join("F:/TrueVoice", pdf_name)
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
    
    print(f"Reading {pdf_name}...")
    try:
        reader = PdfReader(pdf_path)
        full_text = ""
        for i, page in enumerate(reader.pages):
            full_text += f"\n--- Page {i+1} ---\n" + (page.extract_text() or "")
        
        out_name = os.path.splitext(pdf_name)[0] + ".txt"
        out_path = os.path.join("extracted_research", out_name)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"Saved {pdf_name} -> {out_path} ({len(reader.pages)} pages, {len(full_text)} chars)")
    except Exception as e:
        print(f"Error reading {pdf_name}: {e}")

print("Extraction complete!")
