const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  await db.$executeRawUnsafe(`
    UPDATE "Subject" SET "domainId" = (
      SELECT d.id FROM "Domain" d WHERE d.slug = CASE "Subject".slug
        WHEN 'computer-science-foundations' THEN 'computer-science'
        WHEN 'complete-javascript-for-absolute-beginners' THEN 'computer-science'
        WHEN 'operating-systems' THEN 'computer-science'
        WHEN 'computer-networking' THEN 'computer-science'
        WHEN 'logic-building-cpp' THEN 'computer-science'
        WHEN 'advanced-python' THEN 'computer-science'
        WHEN 'python-dsa' THEN 'computer-science'
        WHEN 'html-foundations' THEN 'web-development'
        WHEN 'css-design-systems' THEN 'web-development'
        WHEN 'javascript-mastery' THEN 'web-development'
        WHEN 'javascript-web-development-master-book' THEN 'web-development'
        WHEN 'python-engineering' THEN 'software-engineering'
        WHEN 'python-backend-development' THEN 'software-engineering'
        WHEN 'master-english-easily' THEN 'interview-preparation'
        WHEN 'fresher-to-job-ready-data-analyst' THEN 'interview-preparation'
        WHEN 'backend-developer-interview-mastery' THEN 'interview-preparation'
        WHEN 'backend-engineering-to-ai-systems' THEN 'backend-systems'
        WHEN 'advanced-backend-and-system-design' THEN 'backend-systems'
        WHEN 'backend-development-and-databases' THEN 'backend-systems'
        WHEN 'ai-from-scratch' THEN 'artificial-intelligence'
        WHEN 'ai-ml-handbook-volume-1' THEN 'artificial-intelligence'
        WHEN 'ai-ml-handbook-volume-2' THEN 'artificial-intelligence'
        WHEN 'aiml-engineer' THEN 'artificial-intelligence'
        WHEN 'from-neurons-to-gpt' THEN 'artificial-intelligence'
      END
    )
    WHERE "Subject".slug IN (
      'computer-science-foundations','complete-javascript-for-absolute-beginners',
      'operating-systems','computer-networking','logic-building-cpp',
      'advanced-python','python-dsa','html-foundations','css-design-systems',
      'javascript-mastery','javascript-web-development-master-book',
      'python-engineering','python-backend-development',
      'master-english-easily','fresher-to-job-ready-data-analyst',
      'backend-developer-interview-mastery','backend-engineering-to-ai-systems',
      'advanced-backend-and-system-design','backend-development-and-databases',
      'ai-from-scratch','ai-ml-handbook-volume-1','ai-ml-handbook-volume-2',
      'aiml-engineer','from-neurons-to-gpt'
    )
  `)
  console.log("All 24 courses restored to original domains")
  await db.$disconnect()
}
main()
