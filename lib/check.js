const checkUser = async (username) => {
  let githubOrgMembers = await fetch(
    'https://api.github.com/orgs/the-innovation-circuit/members'
  ).then(r => r.json())
  githubOrgMembers = githubOrgMembers.map(member => member.login)
  return githubOrgMembers.includes(username)
}

export default checkUser