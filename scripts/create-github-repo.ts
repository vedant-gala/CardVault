import { getUncachableGitHubClient } from '../server/githubClient';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = process.argv[2] || 'cardvault';
const REPO_DESCRIPTION = 'CardVault - Cred-inspired credit card management app with authentication, rewards tracking, and AI-powered insights';
const IS_PRIVATE = process.argv[3] === 'private';

async function createGitHubRepo() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`\n✅ Authenticated as: ${user.login}`);
    
    // Create repository
    console.log(`\n📦 Creating repository: ${REPO_NAME}...`);
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: REPO_NAME,
      description: REPO_DESCRIPTION,
      private: IS_PRIVATE,
      auto_init: true
    });
    
    console.log(`✅ Repository created: ${repo.html_url}`);
    console.log(`\n🔗 Clone URL: ${repo.clone_url}`);
    
    // Wait a moment for repo initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get the default branch SHA
    const { data: ref } = await octokit.git.getRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main'
    });
    
    const commitSha = ref.object.sha;
    
    // Create README.md
    const readmeContent = `# CardVault

A Cred-inspired credit card management application with intelligent email/SMS parsing, reward tracking, and automated notifications.

## Features
- 🔐 **User Authentication** - Secure login with Replit Auth (Google, GitHub, email/password)
- 💳 **Card Management** - Add, view, and manage multiple credit cards
- 🎁 **Rewards Tracking** - Configure conditional rewards with progress tracking
- 📱 **SMS Parsing** - Intelligent transaction extraction using OpenAI GPT-5
- 📧 **Email Integration** - Automated parsing of credit card emails from Gmail
- 💰 **Bill Payments** - Track and pay bills with multiple payment methods
- 📊 **Credit Score Tracking** - Monitor credit score history with insights
- 📈 **Spending Analytics** - Category breakdowns and monthly comparisons
- 🤖 **AI Recommendations** - Personalized credit card offers based on spending
- 🔔 **Real-Time Notifications** - WebSocket push notifications for transactions

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Express, Node.js, TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Replit Auth with OIDC
- **AI**: OpenAI GPT-5
- **Real-time**: WebSocket for push notifications

## Getting Started

1. Clone the repository
\`\`\`bash
git clone ${repo.clone_url}
cd ${REPO_NAME}
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
DATABASE_URL=<your-postgresql-url>
OPENAI_API_KEY=<your-openai-key>
SESSION_SECRET=<random-secret>
\`\`\`

4. Run database migrations
\`\`\`bash
npm run db:push
\`\`\`

5. Start the development server
\`\`\`bash
npm run dev
\`\`\`

## Security
- Complete user data isolation with userId-based filtering
- Resource-level ownership verification on all operations
- PostgreSQL-backed session management with secure cookies
- Protected API routes with isAuthenticated middleware

## License
MIT

---
Built with ❤️ by ${user.login}
`;
    
    await octokit.repos.createOrUpdateFileContents({
      owner: user.login,
      repo: REPO_NAME,
      path: 'README.md',
      message: 'Add README',
      content: Buffer.from(readmeContent).toString('base64'),
      branch: 'main'
    });
    
    console.log('✅ README.md created');
    console.log(`\n📝 Next steps:`);
    console.log(`1. Visit ${repo.html_url}`);
    console.log(`2. Clone your repository locally to push your code`);
    console.log(`3. Or use the GitHub web interface to upload files\n`);
    
  } catch (error: any) {
    if (error.status === 422) {
      console.error(`❌ Repository "${REPO_NAME}" already exists. Try a different name.`);
      console.log(`\nUsage: npx tsx scripts/create-github-repo.ts <repo-name> [private]\n`);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

createGitHubRepo();
