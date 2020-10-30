import csv

class Logger:

    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        

    def writeToCSV(self, first_point, second_point):
        with open(self.filename, mode='a') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter=',')
            csv_writer.writerow([first_point,second_point])