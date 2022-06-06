import os
from CONFIG import *

def main():

    # Get current directory
    dir_path = os.path.dirname(os.path.realpath(__file__))

    # Run Scraper Module
    os.chdir("./modules/scraper")
    os.system('node index.js')

    # Run Cleaner Module
    os.chdir(venv_path)
    os.system('source ' + venv_path + '/bin/activate ; cd ' + dir_path + '/modules/cleaner; python3 clean.py')

    # Open the newly created excel spreadsheet
    print('Openning the excel file...')
    os.chdir(dir_path)
    os.system("open -a 'Microsoft Excel.app' './output/DATAFILE.xlsx'")

    print('ALL DONE - SCRAPE & CLEAN COMPLETED SUCCESSFULLY!')

if __name__ == "__main__":
    main()
