import time
import requests
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer

def image_processor(url, image_model, processor):
    image = Image.open(requests.get(url, stream=True).raw)
    
    explanation = ["sexual - Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness).", 
                   "hate - Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.", 
                   "violence - Content that promotes or glorifies violence or celebrates the suffering or humiliation of others.", 
                   "harassment - Content that may be used to torment or annoy individuals in real life, or make harassment more likely to occur.", 
                   "self-harm - Content that promotes, encourages, or depicts acts of self-harm, such as suicide, cutting, and eating disorders.", 
                   "sexual/minors - Sexual content that includes an individual who is under 18 years old.", 
                   "hate/threatening - Hateful content that also includes violence or serious harm towards the targeted group.", 
                   "violence/graphic - Violent content that depicts death, violence, or serious physical injury in extreme graphic detail.", 
                   "OK - Not offensive"]
    
    inputs = processor(text=explanation, images=image, return_tensors="pt", padding=True)
    
    tags = ["S", "H", "V", "HR", "SH", "S3", "H2", "V2", "OK"]
    
    outputs = image_model(**inputs)
    logits_per_image = outputs.logits_per_image  # this is the image-text similarity score
    probs = logits_per_image.softmax(dim=1)  # we can take the softmax to get the label probabilities
    
    probs = probs[0].tolist()
    
    # Combine tags and probabilities, then sort by probability in descending order
    labeled_probs = list(zip(tags, probs))
    sorted_labeled_probs = sorted(labeled_probs, key=lambda x: x[1], reverse=True)
    
    return sorted_labeled_probs[0][0]
    # for tag, prob in sorted_labeled_probs:
        # print(f"Label: {tag} - Probability: {prob:.4f}")

def text_processor(text, text_model, tokenizer):
    # Run the model on your input
    inputs = tokenizer(text, return_tensors="pt")
    outputs = text_model(**inputs)
    
    # Get the predicted logits
    logits = outputs.logits
    
    # Apply softmax to get probabilities (scores)
    probabilities = logits.softmax(dim=-1).squeeze()
    
    # Retrieve the labels
    id2label = text_model.config.id2label
    labels = [id2label[idx] for idx in range(len(probabilities))]
    
    # Combine labels and probabilities, then sort
    label_prob_pairs = list(zip(labels, probabilities))
    label_prob_pairs.sort(key=lambda item: item[1], reverse=True)  
    
    return label_prob_pairs[0][0]
    # Print the sorted results
    # for label, probability in label_prob_pairs:
        # print(f"Label: {label} - Probability: {probability:.4f}")

def main():
    # Load the image model and processor 
    image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    
    # Load the text model and tokenizer
    text_model = AutoModelForSequenceClassification.from_pretrained("KoalaAI/Text-Moderation")
    tokenizer = AutoTokenizer.from_pretrained("KoalaAI/Text-Moderation")

    start = time.time()
    url = "https://t4.ftcdn.net/jpg/01/26/76/63/240_F_126766387_3C3kQ2ZAi0in4J6T6J0cwCaKZ3BjhrVa.jpg"
    print("Input image: ", url)
    image_tag = image_processor(url, image_model, processor)
    print("Image classified with tag: ", image_tag)
    end = time.time()
    print(f"Total processing time: {end - start:.2f} seconds")
    
    print()

    start = time.time()
    text = "Im having a very joyful day"
    print("Input text: ", text)
    text_tag = text_processor(text, text_model, tokenizer)
    print("Text classified with tag: ", text_tag)
    end = time.time()
    print(f"Total processing time: {end - start:.2f} seconds")
    
if __name__ == '__main__':
    main()
