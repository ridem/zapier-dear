# Zapier DEAR Inventory

A Zapier CLI App for DEAR Inventory. Here are the features it covers so far:

## Triggers
- New Sale. Triggers when there is a new sale recorded on DEAR. You can filter them afterwards through Zapier filters
- New Template. Triggers when there is a new resource template created on DEAR. It's also used to fetch the list of templates when generating a PDF.

## Search
- Find Sale. Find a Sale.

## Create
- Generate a PDF. Generates the PDF for a given resource and template.

## Example
Here's an example for a Zap you can do:
When there is a new Sale on DEAR, write a message on Slack with the details of the sale, then send an email with the invoice for this sale as an attachment.
