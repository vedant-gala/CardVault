import { getUncachableGitHubClient } from '../server/githubClient';

async function uploadToGitHub() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user info
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`\n✅ Authenticated as: ${user.login}`);
    
    // List user's repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 10
    });
    
    console.log('\n📦 Your recent repositories:');
    repos.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.full_name} - ${repo.html_url}`);
    });
    
    console.log('\n🚀 To upload your CardVault code to GitHub:');
    console.log('\n1. Create a new repository on GitHub (https://github.com/new)');
    console.log('   - Name it "cardvault" (or any name you prefer)');
    console.log('   - Keep it public or private');
    console.log('   - DO NOT initialize with README, .gitignore, or license\n');
    
    console.log('2. Run these commands in the Shell:');
    console.log('   git init');
    console.log('   git add .');
    console.log('   git commit -m "Initial commit: CardVault app with authentication"');
    console.log('   git branch -M main');
    console.log(`   git remote add origin https://github.com/${user.login}/cardvault.git`);
    console.log('   git push -u origin main\n');
    
    console.log('📝 Note: Replace "cardvault" with your actual repository name if different\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

uploadToGitHub();
