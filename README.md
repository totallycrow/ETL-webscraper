# ETL-webscraper

ETL-webscraper is an app that combines a web scraper that scans and grabs "recently added" release data from aboveboard distribution website, and a helper "cleaner" module that reformats data into a required format.

## Features

- Gather new releases data and save it to a .json file
- Clean, reformat and modify data
- Save cleaned data to an Excel Spreadsheet

## Tech

ETL-webscraper uses a number of open source projects to work properly:

- [node.js]
- puppeteer
- Python3
- Pandas
- Numpy
- Openpyxl

## Pre-requisites

You need a B2B account with abboveboarddist (KRD).
You need Microsoft Excel to open the output data file.

## Installation (MACOS / LINUX)

### Update config Files

In ./CONFIG.py update venv_path with a path to your venv you'll use, and update variable "discount" with your actual discount percentage value as a string (ie 50% = "50").

In ./modules/scraper update CONSTS.js file with your own user and password details.

### Dependencies

ETL-webscraper requires [Node.js] and Python3 to run.

Install Python3 dependencies...

```sh
cd ETL-webscraper
pip3 install -r requirements.txt
```

...and node dependencies...

```sh
cd ./modules/scraper/
npm i
```

### Start the application

...and run the application...

```sh
cd ETL-webscraper
python3 scrape.py
```

### Output

Cleaned and transformed Excel file is exported to ./output/DATAFILE.xlsx.
