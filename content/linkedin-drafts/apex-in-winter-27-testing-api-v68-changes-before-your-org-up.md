---
slug: apex-in-winter-27-testing-api-v68-changes-before-your-org-up
sourceUrl: >-
  https://www.bennierichard.com/blog/apex-in-winter-27-testing-api-v68-changes-before-your-org-up
generatedAt: '2026-10-05T09:34:21.327Z'
model: gpt-6-astra
maxWords: 180
maxCharacters: 2600
wordCount: 141
characterCount: 1104
humanReviewRequired: true
---
An org upgrade does not automatically advance the saved API versions of Apex classes and triggers. Winter ’27 runtime compatibility and API v68 adoption need separate tests.

In this article, I recommend holding source and component versions steady for the runtime comparison, then increasing selected versions in a separate run. Changing packages, permissions, and compile versions together makes failures harder to attribute.

Test discovery deserves its own check. At the v68 endpoint, testLevel replaces showAllMethods; omitting it defaults to RunAllTestsInOrg. An HTTP success response is not enough—CI needs to verify which tests it actually discovered.

The same discipline applies to capacity: record the effective heap ceiling, keep workload expectations unchanged during compatibility testing, and evaluate larger payloads separately.

Which part of your Winter ’27 test plan needs a clearer boundary: runtime compatibility, component-version adoption, or CI discovery?

https://www.bennierichard.com/blog/apex-in-winter-27-testing-api-v68-changes-before-your-org-up

#Salesforce #Apex #Testing
