const Vote = artifacts.require('./Vote');
require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Vote', ([user1, user2, user3])=>{
   
    beforeEach(async ()=>{
        console.log('working')
    })

})