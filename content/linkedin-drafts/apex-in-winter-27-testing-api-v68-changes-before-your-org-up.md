---
slug: apex-in-winter-27-testing-api-v68-changes-before-your-org-up
sourceUrl: >-
  https://www.bennierichard.com/blog/apex-in-winter-27-testing-api-v68-changes-before-your-org-up
generatedAt: '2026-10-08T15:51:06.152Z'
model: gpt-6-astra
maxWords: 180
maxCharacters: 2600
wordCount: 140
characterCount: 1093
humanReviewRequired: true
---
Winter ’27’s Apex heap-limit increase follows the org upgrade schedule—not a requirement to recompile every class at API v68.0.

That distinction matters when a regression suite starts failing. Changing the runtime and every class version together makes the cause harder to isolate.

In this article, I recommend testing unchanged Apex on the upgraded runtime first. Then move selected classes to v68 in a separate comparison, keeping the Winter ’27 environment fixed.

Client API versions need their own check. At v68, Test Discovery uses testLevel instead of showAllMethods. A successful request isn’t enough: compare the discovered test identities and investigate unexplained scope changes.

The approval criteria should go beyond compilation and coverage: correct business results, preserved authorization, and workloads completing within their agreed budgets.

How does your regression plan distinguish runtime compatibility from deliberate Apex version adoption?

https://www.bennierichard.com/blog/apex-in-winter-27-testing-api-v68-changes-before-your-org-up

#Salesforce #Apex #Testing
