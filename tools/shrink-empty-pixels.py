from PIL import Image
from PIL.Image import Resampling
import sys

import numpy as np
import glob

for f in glob.glob("../public/filters/*.png"):
    try:
        im = Image.open(f)
        pix = np.asarray(im)

        pix = pix[:,:,0:3] # Drop the alpha channel
        idx = np.where(pix-255)[0:2] # Drop the color when finding edges
        box = list(map(min,idx))[::-1] + list(map(max,idx))[::-1]

        region = im.crop(box)
        print('saving cropped ' + f)
        region.thumbnail((1000, sys.maxsize), Resampling.LANCZOS)
        region = region.convert("P", palette=Image.ADAPTIVE, colors=256)
        region.save(f, optimize=True)
    except Exception as e:
        print('error saving cropped ' + f)
        # print(e)

    # region_pix = np.asarray(region)

    # subplot(121)
    # imshow(pix)
    # subplot(122)
    # imshow(region_pix)
    # show()