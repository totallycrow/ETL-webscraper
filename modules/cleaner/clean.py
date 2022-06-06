import pandas as pd
import numpy as np
import sys

sys.path.insert(0,'../..')
from CONFIG import discount

def main():
    
    print('Starting cleaning module')

    df = pd.read_json('../scraper/values.json')

    # Set first row to dataframe header
    df.columns = df.iloc[0]
    df = df[1:]

    ##### Basic Cleaning
    ## Remove commas and semicolons
    df = df.replace({', ': ' / '}, regex=True)
    df = df.replace({'; ': ' / '}, regex=True)

    #Remove redundant characters
    df['Price'].replace('£', '', regex=True, inplace=True)
    df['Label'].replace('\t\t\t', '', regex=True, inplace=True)


    df.insert(4, "No Of Disks", "1")

    # Release Date Cleaning
    release_col = 'Release Date'

    df[release_col].replace(r'\s+|\\n', ' ', regex=True, inplace=True)
    df[release_col].replace('[INITIAL RELEASE]', '', regex=True, inplace=True)
    df[release_col] = df[release_col].str[:-2]

    # Set Empty Barcode field to "0"
    df['Barcode'].replace({'Barcode': '0'}, regex=True, inplace=True)
    

    # Insert additional required fixed data fields
    df.insert(9, "Discount", discount)    

    df.insert(10, "Product Status", "Active")
    df.insert(11, "Archived", "No")

    df['Genre'].replace(' / ', '/', regex=True, inplace=True)
    df['Genre'] = df['Genre'].str.upper()

    # Modify number of disks accordingly to format
    df['No Of Disks'] =  np.where(df['Format'].str.match(r'^[0-9] x .*')
     | df['Format'].str.match(r'^[0-9]x.*'),df['Format'].str[0] , df['No Of Disks'])

    # Reformat 'Format' Column
    df['Format'].replace('Cassette', 'CASS', regex=True, inplace=True)
    df['Format'].replace('2 x 12"', '12"x2', regex=True, inplace=True)
    df['Format'].replace('3 x 12"', '12"x3', regex=True, inplace=True)
    df['Format'].replace('4 x 12"', '12"x4', regex=True, inplace=True)

    df['Format'].replace('12" LP', 'LP', regex=True, inplace=True)

    # Modify Discount Based on Extra Details in Price column ('NO DISCOUNTS' String after price)
    df['Price'] =  df['Price'].str.upper()
    df['Discount'] = np.where(df['Price'].str[-1] == "S", 0, df['Discount'])
    df['Price'].replace([' NO DISCOUNTS','NO DISCOUNTS'], '', regex=True, inplace=True)

    df['Barcode'].replace('0', '', regex=True, inplace=True)

    # Move Release Date to Index Column
    df.set_index(release_col, inplace=True)
    
    # Save to excel
    df.to_excel('../../output/DATAFILE.xlsx')
    print('Cleaning complete!')
if __name__ == "__main__":
    main()




