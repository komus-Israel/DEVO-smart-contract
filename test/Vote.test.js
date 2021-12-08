const Vote = artifacts.require('./Vote');
require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Vote', ([user1, user2, user3])=>{

    let vote
   
    beforeEach(async ()=>{
        vote = await Vote.new()
    })

    describe("registration of electorates", ()=>{

        //  initialize the details of the electorate to be registered

        const firstName = 'Israel';
        const lastName = 'Timilehin';
        const middlename = 'Tope';
        const state = 'Oyo';
        const nin = '1245454';
        const address = 'user1';
        

        it("was successful", async()=>{

            // register user1

           
            
                const register = await vote.registerVoter(
                    firstName,
                    lastName,
                    middlename,
                    state,
                    nin,
    
                    { from: user1 }
                )

            //  test the name of the event for this function call
            register.logs[0].event.should.be.equal('Registered')
            

            //  test that the address in the event is the address we registered
            register.logs[0].args._address.should.be.equal(user1)
        })

        it("failed", async()=>{

        })

    })

})