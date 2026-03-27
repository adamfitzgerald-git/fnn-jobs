const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create super admin
  const adminPassword = await bcrypt.hash("admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@firstnationsnews.com.au" },
    update: {},
    create: {
      name: "FNN Admin",
      email: "admin@firstnationsnews.com.au",
      hashedPassword: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Created super admin:", admin.email);

  // Create employers
  const employers = await Promise.all([
    prisma.employer.upsert({
      where: { slug: "rio-tinto" },
      update: {},
      create: {
        name: "Rio Tinto",
        slug: "rio-tinto",
        sector: "Resources",
        headquarters: "Melbourne, VIC",
        websiteUrl: "https://www.riotinto.com",
        shortDescription:
          "Rio Tinto is a global mining group that focuses on finding, mining and processing the Earth's mineral resources. We are committed to meaningful reconciliation and increasing First Nations representation across our workforce.",
        fullDescription: `<p>Rio Tinto is one of the world's largest metals and mining corporations. We produce materials essential to human progress — iron ore, aluminium, copper, and minerals.</p>
<h3>Our commitment to First Nations employment</h3>
<p>We are committed to building a diverse and inclusive workforce. Our Reconciliation Action Plan sets out clear targets for Indigenous employment, procurement, and community engagement across all Australian operations.</p>
<p>We offer structured pathways including traineeships, apprenticeships, graduate programs, and experienced-hire roles specifically designed to support First Nations careers in mining and corporate functions.</p>`,
        rapTier: "ELEVATE",
        contactName: "Sarah Williams",
        contactEmail: "indigenous.employment@riotinto.com",
        linkedinUrl: "https://linkedin.com/company/rio-tinto",
        status: "PUBLISHED",
      },
    }),
    prisma.employer.upsert({
      where: { slug: "commonwealth-bank" },
      update: {},
      create: {
        name: "Commonwealth Bank",
        slug: "commonwealth-bank",
        sector: "Finance",
        headquarters: "Sydney, NSW",
        websiteUrl: "https://www.commbank.com.au",
        shortDescription:
          "Commonwealth Bank is Australia's leading provider of financial services. We are deeply committed to reconciliation and creating career opportunities for First Nations Australians.",
        fullDescription: `<p>Commonwealth Bank of Australia (CBA) provides a variety of financial services including retail, business and institutional banking, funds management, superannuation, insurance, investment and broking services.</p>
<h3>Indigenous Employment Program</h3>
<p>Our Indigenous Employment Program creates pathways to meaningful careers in banking and finance. We partner with communities to deliver tailored recruitment, training, and mentoring programs.</p>
<p>CBA's RAP commits to increasing Indigenous employment at all levels, from entry-level to senior leadership positions. We offer flexible work arrangements and culturally safe workplaces.</p>`,
        rapTier: "STRETCH",
        contactName: "David Chen",
        contactEmail: "indigenous.careers@cba.com.au",
        linkedinUrl: "https://linkedin.com/company/commonwealth-bank",
        status: "PUBLISHED",
      },
    }),
    prisma.employer.upsert({
      where: { slug: "nsw-health" },
      update: {},
      create: {
        name: "NSW Health",
        slug: "nsw-health",
        sector: "Health",
        headquarters: "Sydney, NSW",
        websiteUrl: "https://www.health.nsw.gov.au",
        shortDescription:
          "NSW Health is the state's largest employer, providing health services across hospitals, community health centres, and specialist facilities. We are committed to closing the gap in health outcomes.",
        fullDescription: `<p>NSW Health is responsible for providing and managing public health services across New South Wales. With over 170,000 employees, we deliver care through a network of hospitals, community health services, and specialist centres.</p>
<h3>Aboriginal Health Workforce</h3>
<p>NSW Health is actively growing its Aboriginal health workforce. We recognise that a strong Aboriginal workforce is essential to delivering culturally responsive care and improving health outcomes for Aboriginal communities.</p>
<p>We offer identified positions, cadetships, scholarships, and career development pathways specifically for Aboriginal and Torres Strait Islander people across clinical and non-clinical roles.</p>`,
        rapTier: "INNOVATE",
        contactName: "Aunty Margaret",
        contactEmail: "aboriginal.employment@health.nsw.gov.au",
        status: "PUBLISHED",
      },
    }),
    prisma.employer.upsert({
      where: { slug: "lendlease" },
      update: {},
      create: {
        name: "Lendlease",
        slug: "lendlease",
        sector: "Construction",
        headquarters: "Sydney, NSW",
        websiteUrl: "https://www.lendlease.com",
        shortDescription:
          "Lendlease is an international property and infrastructure group with operations across Australia, Asia, Europe and the Americas. We are committed to creating sustainable communities and meaningful Indigenous employment.",
        fullDescription: `<p>Lendlease is a globally integrated real estate and investment group with core expertise in shaping cities and creating strong and connected communities.</p>
<h3>Indigenous Participation</h3>
<p>Lendlease has set ambitious targets for Indigenous employment and procurement across our Australian projects. Our RAP drives meaningful outcomes in construction, development, and corporate roles.</p>`,
        rapTier: "STRETCH",
        contactName: "James Murray",
        contactEmail: "indigenous.employment@lendlease.com",
        linkedinUrl: "https://linkedin.com/company/lendlease",
        status: "PUBLISHED",
      },
    }),
    prisma.employer.upsert({
      where: { slug: "department-of-education" },
      update: {},
      create: {
        name: "Department of Education",
        slug: "department-of-education",
        sector: "Government",
        headquarters: "Canberra, ACT",
        websiteUrl: "https://www.education.gov.au",
        shortDescription:
          "The Australian Government Department of Education works to ensure all Australians have access to quality education. We actively recruit First Nations people across policy, program delivery, and corporate services.",
        fullDescription: `<p>The Department of Education is responsible for national policies and programs that help Australians access quality early childhood education, school education, higher education, and international education.</p>
<h3>First Nations Employment</h3>
<p>The Department maintains a commitment to increasing Aboriginal and Torres Strait Islander employment across all classification levels. We offer identified positions, the Indigenous Apprenticeship Program, and targeted graduate opportunities.</p>`,
        rapTier: "INNOVATE",
        contactName: "Karen Nampijinpa",
        contactEmail: "indigenous.recruitment@education.gov.au",
        status: "PUBLISHED",
      },
    }),
  ]);

  console.log(`Created ${employers.length} employers`);

  // Create employer admin accounts
  const employerAdminPassword = await bcrypt.hash("employer123!", 12);
  for (const employer of employers) {
    await prisma.user.upsert({
      where: { email: `admin@${employer.slug}.example.com` },
      update: {},
      create: {
        name: `${employer.name} Admin`,
        email: `admin@${employer.slug}.example.com`,
        hashedPassword: employerAdminPassword,
        role: "EMPLOYER_ADMIN",
        employerId: employer.id,
      },
    });
  }
  console.log("Created employer admin accounts");

  // Create job listings
  const jobs = [
    {
      title: "Indigenous Employment Coordinator",
      employer: employers[0], // Rio Tinto
      location: "Perth, WA",
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      salaryRange: "$95,000–$110,000 + super",
      identifiedRole: true,
      description: `<h3>About the role</h3>
<p>We are seeking an Indigenous Employment Coordinator to drive our First Nations recruitment and retention strategies across Western Australian operations.</p>
<h3>Key responsibilities</h3>
<ul>
<li>Develop and implement Indigenous employment strategies aligned with our RAP commitments</li>
<li>Build relationships with Aboriginal communities, employment agencies, and education providers</li>
<li>Coordinate pre-employment programs, traineeships, and onboarding for Indigenous employees</li>
<li>Provide mentoring and support to Indigenous employees across the business</li>
<li>Track and report on Indigenous employment metrics and targets</li>
</ul>
<h3>About you</h3>
<ul>
<li>Aboriginal and/or Torres Strait Islander person (identified role)</li>
<li>Experience in Indigenous employment, community engagement, or HR</li>
<li>Strong understanding of cultural protocols and community dynamics</li>
<li>Excellent communication and relationship-building skills</li>
</ul>`,
      applyMethod: "EMAIL",
      applyValue: "indigenous.employment@riotinto.com",
      closingDate: new Date("2026-05-15"),
    },
    {
      title: "Graduate Analyst — Indigenous Program",
      employer: employers[1], // CBA
      location: "Sydney, NSW",
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      salaryRange: "$72,000–$78,000 + super",
      identifiedRole: true,
      description: `<h3>About the role</h3>
<p>Join our Indigenous Graduate Program and begin a rewarding career in banking and financial services. This 18-month rotational program offers exposure to multiple areas of the bank.</p>
<h3>What you'll do</h3>
<ul>
<li>Rotate through 3 different business areas including retail, risk, and technology</li>
<li>Participate in structured learning and development</li>
<li>Receive dedicated mentoring from senior leaders</li>
<li>Contribute to meaningful projects that impact customers and communities</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>Aboriginal and/or Torres Strait Islander person</li>
<li>Completed or completing a bachelor's degree in any discipline</li>
<li>Passionate about building a career in financial services</li>
</ul>`,
      applyMethod: "EMAIL",
      applyValue: "indigenous.careers@cba.com.au",
      closingDate: new Date("2026-04-30"),
    },
    {
      title: "Aboriginal Health Worker",
      employer: employers[2], // NSW Health
      location: "Orange, NSW",
      workMode: "ON_SITE",
      employmentType: "FULL_TIME",
      salaryRange: "$65,000–$75,000 + super",
      identifiedRole: true,
      description: `<h3>About the role</h3>
<p>Provide culturally appropriate health care and support to Aboriginal patients and communities across the Western NSW Local Health District.</p>
<h3>Key duties</h3>
<ul>
<li>Deliver primary health care services to Aboriginal clients</li>
<li>Provide health education and promote preventative health in Aboriginal communities</li>
<li>Liaise between Aboriginal patients, families, and health care providers</li>
<li>Participate in community health programs and outreach activities</li>
<li>Maintain accurate health records and contribute to data reporting</li>
</ul>
<h3>Essential criteria</h3>
<ul>
<li>Aboriginality — this is an identified position under Section 14(d) of the Anti-Discrimination Act</li>
<li>Certificate IV in Aboriginal and/or Torres Strait Islander Primary Health Care or equivalent</li>
<li>Current driver's licence</li>
<li>Working with Children Check</li>
</ul>`,
      applyMethod: "URL",
      applyValue: "https://jobs.health.nsw.gov.au",
      closingDate: new Date("2026-04-20"),
    },
    {
      title: "Project Manager — Infrastructure",
      employer: employers[3], // Lendlease
      location: "Melbourne, VIC",
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      salaryRange: "$120,000–$140,000 + super",
      identifiedRole: false,
      description: `<h3>About the role</h3>
<p>Lead and deliver infrastructure projects across our Victorian portfolio. This role is open to all candidates and is a great opportunity for First Nations people interested in construction and infrastructure.</p>
<h3>Responsibilities</h3>
<ul>
<li>Manage project delivery from planning through to completion</li>
<li>Coordinate with stakeholders, contractors, and internal teams</li>
<li>Manage project budgets, timelines, and risk</li>
<li>Ensure compliance with safety, quality, and environmental standards</li>
<li>Support Indigenous participation targets on projects</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>5+ years project management experience in construction or infrastructure</li>
<li>Tertiary qualification in engineering, construction management, or related field</li>
<li>Strong stakeholder management skills</li>
</ul>`,
      applyMethod: "EMAIL",
      applyValue: "careers@lendlease.com",
      closingDate: new Date("2026-05-01"),
    },
    {
      title: "Policy Officer — Indigenous Education",
      employer: employers[4], // Dept of Education
      location: "Canberra, ACT",
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      salaryRange: "$85,000–$95,000 + super",
      identifiedRole: true,
      description: `<h3>About the role</h3>
<p>Contribute to national policies that improve education outcomes for Aboriginal and Torres Strait Islander students across Australia.</p>
<h3>Key responsibilities</h3>
<ul>
<li>Research and analyse Indigenous education data and policy</li>
<li>Prepare briefs, reports, and policy recommendations for senior executives</li>
<li>Engage with Indigenous communities, education providers, and state/territory governments</li>
<li>Support the implementation of the National Agreement on Closing the Gap education targets</li>
</ul>
<h3>Selection criteria</h3>
<ul>
<li>Aboriginal and/or Torres Strait Islander person (identified role under Section 51 of the PSA)</li>
<li>Experience in policy development, research, or program delivery</li>
<li>Understanding of issues affecting Indigenous education</li>
<li>Strong written and verbal communication skills</li>
</ul>`,
      applyMethod: "URL",
      applyValue: "https://www.apsjobs.gov.au",
      closingDate: new Date("2026-04-25"),
    },
    {
      title: "Community Engagement Officer",
      employer: employers[0], // Rio Tinto
      location: "Karratha, WA",
      workMode: "ON_SITE",
      employmentType: "FULL_TIME",
      salaryRange: "$90,000–$105,000 + super + remote allowance",
      identifiedRole: true,
      description: `<h3>About the role</h3>
<p>Build and maintain positive relationships between Rio Tinto and Traditional Owner groups in the Pilbara region of Western Australia.</p>
<h3>Key duties</h3>
<ul>
<li>Facilitate engagement and consultation with Traditional Owner groups</li>
<li>Coordinate community investment programs and cultural heritage management</li>
<li>Support agreement implementation and compliance</li>
<li>Represent Rio Tinto at community events and meetings</li>
</ul>
<h3>About you</h3>
<ul>
<li>Aboriginal and/or Torres Strait Islander person</li>
<li>Strong connections to or understanding of Pilbara Aboriginal communities</li>
<li>Experience in community engagement, stakeholder management, or related field</li>
<li>Current driver's licence (4WD preferred)</li>
</ul>`,
      applyMethod: "EMAIL",
      applyValue: "indigenous.employment@riotinto.com",
      closingDate: new Date("2026-05-10"),
    },
    {
      title: "Trainee — Business Administration",
      employer: employers[1], // CBA
      location: "Brisbane, QLD",
      workMode: "ON_SITE",
      employmentType: "FULL_TIME",
      salaryRange: "$52,000 + super",
      identifiedRole: true,
      description: `<h3>About the role</h3>
<p>Start your career with Commonwealth Bank through our 12-month Indigenous Traineeship program. Gain hands-on experience while completing a Certificate III in Business Administration.</p>
<h3>What's included</h3>
<ul>
<li>Full-time paid traineeship with nationally recognised qualification</li>
<li>Structured on-the-job training and mentoring</li>
<li>Dedicated Indigenous support network</li>
<li>Pathway to permanent employment upon successful completion</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>Aboriginal and/or Torres Strait Islander person</li>
<li>Year 10 or equivalent</li>
<li>Interest in business and financial services</li>
<li>Must not already hold a Certificate III or higher qualification</li>
</ul>`,
      applyMethod: "EMAIL",
      applyValue: "indigenous.careers@cba.com.au",
      closingDate: new Date("2026-04-15"),
    },
    {
      title: "Registered Nurse — Emergency Department",
      employer: employers[2], // NSW Health
      location: "Dubbo, NSW",
      workMode: "ON_SITE",
      employmentType: "FULL_TIME",
      salaryRange: "$72,000–$98,000 + super",
      identifiedRole: false,
      description: `<h3>About the role</h3>
<p>Join our Emergency Department team at Dubbo Base Hospital. This role is open to all qualified nurses and provides an opportunity to deliver care in a regional community with a significant Aboriginal population.</p>
<h3>Responsibilities</h3>
<ul>
<li>Provide high-quality emergency nursing care</li>
<li>Triage, assess, and manage patients presenting to ED</li>
<li>Collaborate with medical, allied health, and Aboriginal Health teams</li>
<li>Participate in quality improvement and professional development</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>Current registration with AHPRA as a Registered Nurse</li>
<li>Minimum 2 years post-registration experience (ED preferred)</li>
<li>Commitment to culturally safe care for Aboriginal patients</li>
</ul>`,
      applyMethod: "URL",
      applyValue: "https://jobs.health.nsw.gov.au",
      closingDate: new Date("2026-05-20"),
    },
  ];

  for (const jobData of jobs) {
    const { employer, ...data } = jobData;
    const slug =
      data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      employer.slug;

    await prisma.job.upsert({
      where: { slug },
      update: {},
      create: {
        ...data,
        slug,
        employerId: employer.id,
        status: "PUBLISHED",
      },
    });
  }

  console.log(`Created ${jobs.length} job listings`);

  // Create sample jobseeker
  const jobseekerPassword = await bcrypt.hash("jobseeker123!", 12);
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo Jobseeker",
      email: "demo@example.com",
      hashedPassword: jobseekerPassword,
      role: "JOBSEEKER",
      location: "Sydney, NSW",
      bio: "Experienced professional seeking opportunities with purpose-driven organisations.",
    },
  });
  console.log("Created demo jobseeker: demo@example.com");

  console.log("\n✓ Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Super Admin:  admin@firstnationsnews.com.au / admin123!");
  console.log("  Jobseeker:    demo@example.com / jobseeker123!");
  console.log("  Employer:     admin@rio-tinto.example.com / employer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
