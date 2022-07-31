from PIL import Image
# from pylab import *

import numpy as np
import glob

for f in glob.glob("../public/filters/*.png"):
    im = Image.open(f)
    pix = np.asarray(im)

    pix = pix[:,:,0:3] # Drop the alpha channel
    idx = np.where(pix-255)[0:2] # Drop the color when finding edges
    box = list(map(min,idx))[::-1] + list(map(max,idx))[::-1]

    region = im.crop(box)
    print('saving cropped ' + f)
    region.save(f, 'png')
    
    # region_pix = np.asarray(region)

    # subplot(121)
    # imshow(pix)
    # subplot(122)
    # imshow(region_pix)
    # show()