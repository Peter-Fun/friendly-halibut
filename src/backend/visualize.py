from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
from PIL import Image, ImageDraw, ImageFont
import textwrap
from fpdf import FPDF
import os
from transformers import pipeline
import io
from urllib.request import urlopen
from pexels_api import API
import requests
import base64


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

image_interpreter = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
saved_images = []
#story_writer = pipeline("text-generation", model="microsoft/phi-1_5", trust_remote_code=True)
#current_story = ""

"""@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://friendly-halibut-qx9q94px5q7hg6w-3000.app.github.dev'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/data', methods=['OPTIONS'])
def preflight():
    response = jsonify({'message': 'Preflight OK'})
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response"""

@app.route("/data", methods=['GET'])
def grab_image():
  query = request.args.get('query')
  photo_count = request.args.get('photo_count', 10)
  PEXELS_API_KEY = "behj5eCKKmrM7pRuBH7OqUu5YMZv7j3qjmNXgrTUNs7epJuDGGx3DYcf"
  # Create API object
  api = API(PEXELS_API_KEY)
  api.search(query, page=1, results_per_page=photo_count)
  # Get photo entries
  photos = api.get_entries()
  images = []
  for photo in photos:
    response = requests.get(photo.medium)
    image_bytes = response.content

    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    images.append(image_base64)
  response = jsonify(message = {"images": images})
  print(response)
  response.headers.add("Access-Control-Allow-Origin", "*")
  return response

@app.route("/visualize", methods=['POST'])
def visualize_post():
  image = request.args.get('image')
  data = request.get_json()
  image = data["image"]
  image = Image.open(io.BytesIO(base64.b64decode(image)))
  interpretation = image_interpreter(image)[0]["generated_text"]
  #story = story_writer(current_story + interpretation)[0]["generated_text"][len(current_story):]
  modified_image = add_text_to_image(image, interpretation)
  buff = io.BytesIO()
  modified_image.save(buff, format="JPEG")
  image_base64 = base64.b64encode(buff.getvalue())
  saved_images.append(image_base64)
  #print(saved_images)
  response = jsonify(message = "Success!")
  response.headers.add("Access-Control-Allow-Origin", "*")
  return response

@app.route("/visualize", methods=['GET'])
def visualize_get():
    image_base64 = saved_images[-1] if saved_images else None
    response = jsonify(message = {"image": image_base64.decode('utf-8')})
    print(response, image_base64[:10])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/final", methods=['GET'])
def final():
    pdf = generate_pdf(saved_images)
    def generate():
        for row in pdf:
            yield row
    return Response(generate(), mimetype='application/pdf')

# add text below the picture book image
def add_text_to_image(img, text):
    # get the font 80% of image width
    fontsize = 1
    img_fraction = 0.80
    font = ImageFont.load_default(size = fontsize)
    while True:
        left, top, right, bottom = font.getbbox(text)
        width, height = right - left, bottom
        if width < img_fraction*img.size[0]:
            fontsize+=1
            font = ImageFont.load_default(size = fontsize)
        else:
            break
    left, top, right, bottom = font.getbbox(text)
    width, height = right - left, bottom

    wrapped_text = textwrap.fill(text, width=img.width)
    lines = wrapped_text.split("\n")

    # extension of the image to fit the text
    text_height = height
    new_img_height = img.height + text_height * len(lines) + 5
    new_img = Image.new('RGB', (img.width, new_img_height), (255, 255, 255))
    new_img.paste(img, (0, 0))
    draw = ImageDraw.Draw(new_img)

    # wrap the text when exceeding image size
    y_position = img.height + 5
    for line in lines:
        # positioning for the text
        text_bbox = draw.textbbox((0, 0), line, font=font)
        line_width = text_bbox[2] - text_bbox[0]  # width of the text
        line_height = text_bbox[3] - text_bbox[1]  # height of the text
        text_position = ((img.width - line_width) // 2, y_position)
        # add text
        draw.text(text_position, line, font=font, fill="black")
        # move to next line
        y_position += line_height
    return new_img



# convert a list of images and compile into a pdf
def generate_pdf(images):
    pdf = FPDF()
    for img in images:
        pdf.add_page()
        print(img)
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="JPEG")
        img_buffer.seek(0)
        temp_filename = str(st.session_state["counter"]) + ".jpg"
        with open(temp_filename, "wb") as f:
            f.write(img_buffer.read())
        pdf.image(temp_filename, x=10, y=10, w=180)
        os.remove(temp_filename)
        st.session_state["counter"] += 1
        print(pdf)
    pdf_buffer = io.BytesIO(pdf.output(dest = "S"))
    pdf_buffer.seek(0)
    return pdf_buffer

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


"""
if "images_with_captions" not in st.session_state:
    st.session_state["images_with_captions"] = []
if "selected_index" not in st.session_state:
    st.session_state["selected_index"] = 0
if "counter" not in st.session_state:
    st.session_state["counter"] = 0
if "current_story" not in st.session_state:
    st.session_state["current_story"] = ""
if "image_interpreter" not in st.session_state:
    st.session_state["image_interpreter"] = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
if "story_writer" not in st.session_state:
    st.session_state["story_writer"] = pipeline("text-generation", model="microsoft/phi-1_5", trust_remote_code=True)

option = st.radio("", ["Upload Your Own Image", "Search for Images"])

selected_image = None

if option == "Upload Your Own Image":
    uploaded_image = st.file_uploader("Upload an image", type=["jpg", "png", "jpeg"])
    if uploaded_image is not None:
        selected_image = Image.open(uploaded_image)
        st.image(selected_image, caption="Uploaded Image", use_container_width = True)

elif option == "Search for Images":
    query = st.text_input("Enter a search term (e.g., 'sunset', 'forest'):")
    if query:
        images = grab_image(query)
        if images:
            selected_index = st.selectbox(
                "Choose an image:",
                range(len(images)),
                format_func=lambda i: f"Image {i+1}"
            )
            selected_image = images[selected_index]
            st.image(selected_image, caption="Selected Image", use_container_width = True)
            st.session_state["selected_index"] = selected_index

if selected_image is not None:
    if st.button("Visualize!!!"):
        interpretation = st.session_state["image_interpreter"](selected_image)[0]["generated_text"]
        story = st.session_state["story_writer"](st.session_state["current_story"] + interpretation)[0]["generated_text"][len(st.session_state["current_story"]):]
        modified_image = add_text_to_image(selected_image, story)
        # display the modified image
        st.image(modified_image, caption="Image with Text", use_container_width = True)
        # allow the user to download the modified image

        st.session_state["images_with_captions"].append(modified_image)
        st.session_state["current_story"] += story
        print(st.session_state["images_with_captions"])
        st.success("Image visualized! Upload more, switch options, or clear your creation.")

if st.session_state["images_with_captions"] != []:
  if st.button("Clear Creation"):
    st.session_state["images_with_captions"] = []
    st.session_state["current_story"] = ""
    st.success("Cleared! Go ahead and work on another creation!")

  st.download_button(label="Download PDF", data=generate_pdf(st.session_state["images_with_captions"]), file_name="visualized_images.pdf", mime="application/pdf")""
"""