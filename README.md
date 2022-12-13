# Playfair Cipher Software

Created for CSC 483 in Fall 2022 at NKU.

This software enciphers and deciphers Playfair ciphers. It also assists with cryptanalyzing Playfair Ciphers.
The software is split into two sections: Encipher/Decipher and Cryptanalyze.

## Encipher/Decipher

This page allows the user to encipher and decipher Playfair ciphers.

- The input textbox is where the user inputs the text they wish to encipher/decipher
- The output textbox is where the enciphered/deciphered text gets outputted to
- The mode radio buttons tell the software whether to encipher or decipher the input
- The output style radio buttons tell the software whether to output in two-letter blocks, five-letter blocks, or as a single string
- The keyword textbox and button allows the user to form a Playfair sqaure using a specified keyword
- The 5x5 grid of textboxes is the square itself which allows the user to fill it manually or via the keyword box
- The confirm button will encipher/decipher the input and output the result to the output textbox
- The reset button will clear all textboxes and restore radio buttons back to their default state
- The clear square button will clear only the square and no other textboxes/settings
- The cryptanalyze button will take the user to the cryptanalyze page

## Cryptanalyze

This page assists the user is cryptanalyzing a Playfair cipher.

- The plaintext and ciphertext textboxes are where the user inputs the plaintext and ciphertext for cryptanalysis
- The generated ciphertext textbox is where the software will output the ciphertext generated from enciphering the plaintext with the table
- The crib checkbox tells the program whether the plaintext provided is a crib so it does not pad it
- The keyword textbox and button are identical to the encipher/decipher page
- The 5x5 grid of textboxes are also identical to the encipher/decipher page
- The check button will encipher the provided plaintext with the square and compare the resulting ciphertext with the provided ciphertext
- The compare blocks button will display the plaintext and ciphertext side-by-side in two-letter block format. A square is not required for this button to work.
- The reset and clear square buttons are identical to the encipher/decipher page
- The encipher/decipher button will take the user to the encipher/decipher page
