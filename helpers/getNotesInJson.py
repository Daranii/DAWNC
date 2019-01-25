import re
from urllib import request

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

path = r"..\data"

for item in instruments:
    try:
        html = request.urlopen(r"https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/" + item)
        itemContent = html.read().decode()
        toBeDeleted = re.findall(r"if.*\nif.*\nMIDI.*=\s", itemContent)
        itemContent = itemContent.replace(toBeDeleted[0], '')
        with open(path + '\\' + str(item).rsplit('.', 1)[0] + '.json', "w+") as fileWriter:
            fileWriter.write(itemContent)
    except Exception as e:
        print(e)