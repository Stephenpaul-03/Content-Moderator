import sys
import json
import base64
from PIL import Image
import io
from transformers import CLIPProcessor, CLIPModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import os
import time

DEBUG_DIR = 'debug_images'
os.makedirs(DEBUG_DIR, exist_ok=True)

def save_debug_image(image, prefix='debug'):
    timestamp = int(time.time())
    filename = f"{prefix}_{timestamp}.png"
    filepath = os.path.join(DEBUG_DIR, filename)
    image.save(filepath)
    print(f"Debug: Saved image to {filepath}", file=sys.stderr)
    return filepath

def image_processor(image_data, image_model, processor):
    try:
        if not image_data:
            print("Debug: No image data received", file=sys.stderr)
            return 'ERROR'
            
        print(f"Debug: Starting image processing", file=sys.stderr)
        
        # Handle base64 image data
        try:
            if isinstance(image_data, str):
                if ',' in image_data:
                    base64_data = image_data.split(',')[1]
                    image_bytes = base64.b64decode(base64_data)
                else:
                    image_bytes = base64.b64decode(image_data)
            else:
                image_bytes = image_data
                
            original_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            
            # Create a copy for processing
            image = original_image.copy()
            
            # Resize image if needed
            max_size = 224
            if image.size[0] > max_size or image.size[1] > max_size:
                aspect_ratio = image.size[0] / image.size[1]
                if aspect_ratio > 1:
                    new_size = (max_size, int(max_size / aspect_ratio))
                else:
                    new_size = (int(max_size * aspect_ratio), max_size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
        except Exception as e:
            print(f"Debug: Image preprocessing error: {str(e)}", file=sys.stderr)
            return 'ERROR'
            
        # Updated categories with better descriptions and weights
        
        categories = [
            "Safe content Family-friendly, neutral, or harmless content ",
            "Sexual content Explicit or suggestive sexual imagery or text",
            "Hate speech content Content promoting hatred or discrimination.",
            "Violent content Depictions or descriptions of physical violence or harm.",
            "Harassment content Bullying, personal attacks, or threats.",
            "Self-harm content  Glorification or depiction of self-harm or suicide.", 
            "Minor-related inappropriate content Inappropriate or explicit content involving minors.",
            "Threatening content Threats of violence or harm toward individuals, groups, or entities." 
        ]
        
        try:
            inputs = processor(
                images=image,
                text=categories,
                return_tensors="pt",
                padding=True
            )
            
            with torch.no_grad():
                outputs = image_model(**inputs)
                
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
            
            tags = ["OK", "S", "H", "V", "HR", "SH", "S3", "H2"]
            probs = probs[0].tolist()
            
            # Increased threshold for harmful content classification
            # and give preference to "safe technical content" category
            safe_prob = probs[0]
            if safe_prob > 0.3:  # Lower threshold for safe content
                return 'OK'
                
            # Higher threshold for harmful content
            harmful_threshold = 0.6
            top_prob = max(probs[1:])  # Exclude safe category
            top_index = probs.index(top_prob)
            
            if top_prob < harmful_threshold:
                return 'OK'
                
            result = tags[top_index]
            return result
            
        except Exception as e:
            print(f"Debug: CLIP processing error: {str(e)}", file=sys.stderr)
            return 'ERROR'
        
    except Exception as e:
        print(f"Debug: Image processing error: {str(e)}", file=sys.stderr)
        return 'ERROR'
def text_processor(text, text_model, tokenizer):
    try:
        if not text:
            return 'OK'
        
        text = text.lower()

        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = text_model(**inputs)
        
        probabilities = outputs.logits.softmax(dim=-1).squeeze()
        id2label = text_model.config.id2label
        
        # Get top prediction
        top_index = torch.argmax(probabilities).item()
        return id2label[top_index]
        
    except Exception as e:
        print(f"Text processing error: {str(e)}", file=sys.stderr)
        return None
def text_processor(text, text_model, tokenizer):
    try:
        if not text:
            return 'OK'
        
        text = text.lower()

        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = text_model(**inputs)
        
        probabilities = outputs.logits.softmax(dim=-1).squeeze()
        id2label = text_model.config.id2label
        
        # Get top prediction
        top_index = torch.argmax(probabilities).item()
        return id2label[top_index]
        
    except Exception as e:
        print(f"Text processing error: {str(e)}", file=sys.stderr)
        return None

def main():
    try:
        # Load models
        print("Debug: Loading models...", file=sys.stderr)
        image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        text_model = AutoModelForSequenceClassification.from_pretrained("KoalaAI/Text-Moderation")
        tokenizer = AutoTokenizer.from_pretrained("KoalaAI/Text-Moderation")
        print("Debug: Models loaded successfully", file=sys.stderr)

        # Read input and process
        input_data = ''
        for line in sys.stdin:
            input_data += line
            if input_data.strip():  # Only try to parse if we have data
                try:
                    data = json.loads(input_data)
                    break
                except json.JSONDecodeError:
                    continue

        if not input_data.strip():
            raise ValueError("No input data received")

        print(f"Debug: Received raw input: {input_data[:100]}...", file=sys.stderr)
        
        data = json.loads(input_data)
        text = data.get('text', '')
        image_data = data.get('image', '')

        print(f"Debug: Received text length: {len(text)}", file=sys.stderr)
        print(f"Debug: Received image data length: {len(str(image_data))}", file=sys.stderr)

        # Process content
        text_result = text_processor(text, text_model, tokenizer) if text else 'OK'
        print(f"Debug: Text processing result: {text_result}", file=sys.stderr)
        
        image_result = image_processor(image_data, image_model, processor) if image_data else 'ERROR'
        print(f"Debug: Image processing result: {image_result}", file=sys.stderr)

        # Prepare result
        result = {
            'textTag': text_result if text_result else 'ERROR',
            'imageTag': image_result if image_result else 'ERROR'
        }

        print(f"Debug: Final result: {result}", file=sys.stderr)
        
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        print(f"Debug: Main error occurred: {str(e)}", file=sys.stderr)
        error_result = {'error': str(e)}
        print(json.dumps(error_result))
        sys.exit(1)
if __name__ == '__main__':
    main()
