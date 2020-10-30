import time
from time import gmtime, strftime
import os
from os import path


class Logger:

    def write(self, data, filename, id_number, status):
        file = open(filename,"a")
        message = strftime("%Y-%m-%d", gmtime()) + " | " + strftime("%H:%M:%S", gmtime()) + " | Message: " + data + " | Node ID: " + str(id_number) + " | Fire Status: " + status
        file.write(message + "\n")
        file.close()

    def read(self, filename):
        if (path.exists(filename)):
            file = open(filename)
            return file.read()
            file.close()
        else:
            return "File Not Found!"

    def remove(self, filename):
        if (os.path.exists(filename)):
            os.remove(filename)
            return "File Removed!"
        else:
            return "File Not Found!"

    def erase(self, filename):
        if (os.path.exists(filename) and os.path.isfile(filename)):
            file = open(filename, 'w')
            file.close()
            return True
        else:
            return False

