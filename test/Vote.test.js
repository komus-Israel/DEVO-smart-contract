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

            let register
            beforeEach(async()=>{
                const register = await vote.registerVoter(
                    firstName,
                    lastName,
                    middlename,
                    state,
                    nin,
    
                    { from: user1 }
                )
            })
           

            console.log(register)

            //  test the name of the event for this function call
            register.event.should.be.equal('Registered')
        })

        it("failed", async()=>{

        })

    })

})