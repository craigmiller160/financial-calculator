# 401k Calculator

An enhanced version of the calculator I had previously designed to determine how much to contribute to my 401k.

## Output Description

A variety of data is outputted when this application is run:

| Field       | Description                                                                                                                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Gross Pay   | This is the total pay I receive, before taxes, retirement contribution, etc. For TOTALS It includes additional sources of income like investmenets.                                                  |
| AGI/MAGI    | Adjusted Gross Income/Modified Adjusted Gross Income. AGI is what taxes are based on, MAGI is what tax-advantage eligibility is basedd on. For the moment they are both the same in my calcluations. |
| 401k Rate   | The % of a given amount of income contributed to my 401k.                                                                                                                                            |
| 401k Amount | The raw $ amount contributed to my 401k.                                                                                                                                                             |
| HSA Amount  | The raw $ amount contributed to my HSA.                                                                                                                                                              |
| Take Home   | This is the complicated one. This is how much money I take home after taxes, contributions, etc, from my main salary. It does not include additional sources of income.                              |
| Full Income | This captures the total amount of income I am bringing in, including all additional sources (like investments).                                                                                      |

And of course, at the very end it tells me what my new 401k Contribution should be and how much I can contribute to my Roth IRA this year. 

## Taxable Investment Income Criteria

1. Dividends
2. Sale of Shares in Taxable Brokerage
3. RSUs vesting