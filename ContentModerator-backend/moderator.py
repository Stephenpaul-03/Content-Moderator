import sys
import json
from PIL import Image
import io
import base64
from transformers import CLIPProcessor, CLIPModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

def image_processor(image_data, image_model, processor):
    try:
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Define categories
        categories = [
            "sexual content",
            "hate speech",
            "violence",
            "harassment",
            "self-harm",
            "sexual content involving minors",
            "hate speech with threats",
            "graphic violence",
            "safe content"
        ]
        
        # Process image
        inputs = processor(
            images=image,
            text=categories,
            return_tensors="pt",
            padding=True
        )
        
        outputs = image_model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)
        
        # Map probabilities to tags
        tags = ["S", "H", "V", "HR", "SH", "S3", "H2", "V2", "OK"]
        probs = probs[0].tolist()
        
        # Get top prediction
        top_index = probs.index(max(probs))
        
        return tags[top_index]
        
    except Exception as e:
        raise Exception(f"Image processing error: {str(e)}")

def text_processor(text, text_model, tokenizer):
    try:
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = text_model(**inputs)
        
        probabilities = outputs.logits.softmax(dim=-1).squeeze()
        id2label = text_model.config.id2label
        
        # Get top prediction
        top_index = torch.argmax(probabilities).item()
        return id2label[top_index]
        
    except Exception as e:
        raise Exception(f"Text processing error: {str(e)}")

def main():
    try:
        # Load models
        image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        text_model = AutoModelForSequenceClassification.from_pretrained("KoalaAI/Text-Moderation")
        tokenizer = AutoTokenizer.from_pretrained("KoalaAI/Text-Moderation")

        # Read input
        input_data = json.loads(sys.stdin.read())
        text = input_data.get('text', '')
        image_data = input_data.get('image', '')

        # Process content
        text_result = text_processor(text, text_model, tokenizer)
        
        image_result = None
        if image_data:
            image_result = image_processor(image_data, image_model, processor)

        # Always return a result with both tags
        result = {
            'textTag': text_result if text_result else 'OK',
            'imageTag': image_result if image_result else 'OK'
        }

        # Debug log
        print(f"Debug: Processing complete. Result: {result}", file=sys.stderr)
        
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        print(f"Debug: Error occurred: {str(e)}", file=sys.stderr)
        error_result = {'error': str(e)}
        print(json.dumps(error_result), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
