from io import BytesIO

from PIL import Image

IMAGE_SIZE = (256, 256)


def crop_image(file):
    try:
        img = Image.open(file)
    except:
        return None

    width, height = img.size

    if width > height:
        left_right = int(((height - width) * -1) / 2)
        img = img.crop((left_right, 0, width - left_right, height))
    else:
        top_bottom = int(((width - height) * -1) / 2)
        img = img.crop((0, top_bottom, width, height - top_bottom))

    buffer = BytesIO()
    img.resize(IMAGE_SIZE).save(buffer, format="webp")
    return buffer.getvalue()
