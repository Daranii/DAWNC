import re
from urllib import request

""" In the following try except code all the names of the ogg/mp3
    file names are being collected with their specific extension """
try:
    content = request.urlopen(r"https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages/FluidR3_GM")
    data = content.read().decode()
    htmlMp3Instr = re.findall(r'title="(.*-mp3.js)"\s', data)
    htmlOggInstr = re.findall(r'title="(.*-ogg.js)"\s', data)
    instruments = htmlOggInstr + htmlMp3Instr
    del htmlMp3Instr
    del htmlOggInstr
except Exception as e:
    print(e)

""" The path to which the files will be saved is a local folder in the project """
path = r"..\data"

""" In the following code is accesed the download url for each file,
    the content is saved in a variable, it is being processed so it has
    a valid format, and written in the local folder path """
for item in instruments:
    try:
        html = request.urlopen(r"https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/" + item)
        itemContent = html.read().decode()
        toBeDeleted = re.findall(r"if.*\nif.*\nMIDI.*=\s", itemContent)
        itemContent = itemContent.replace(toBeDeleted[0], '')
        if "data:audio/mp3;base64," in itemContent:
            itemContent = itemContent.replace("data:audio/mp3;base64,", '')
        else:
            itemContent = itemContent.replace("data:audio/ogg;base64,", '')
        buffer = itemContent.rsplit(",", 1)
        itemContent = buffer[0] + buffer[1]
        with open(path + '\\' + str(item).rsplit('.', 1)[0] + '.json', "w+") as fileWriter:
            fileWriter.write(itemContent)
    except Exception as e:
        print(e)