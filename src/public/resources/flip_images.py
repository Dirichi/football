import PIL
from PIL import Image
from pathlib import Path
import re

base_directory = Path('.')
image_file_names = [file.as_posix() for file in list(base_directory.glob("**/*.png"))]

def resize(image_file_name):
    image = Image.open(image_file_name)
    output = image.resize((100, 200))
    output.save(image_file_name)

for file_name in image_file_names:
    resize(file_name)

# def flip(image_file_name):
#     image = Image.open(file_name)
#     output = image.transpose(PIL.Image.FLIP_LEFT_RIGHT)
#     new_file_name = re.sub("(.+)/(.+)\.png", "\\1/horizontally_flipped_\\2.png", file_name)
#     output.save(new_file_name)
