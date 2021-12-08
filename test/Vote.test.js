const { EVM_REVERT } = require('./helper')

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
        

        let register;

        beforeEach(async ()=>{
            register = await vote.registerVoter(
                firstName,
                lastName,
                middlename,
                state,
                nin,
    
                { from: user1 }
            )
        })

        describe("success", ()=>{

            it("registers successfully", async()=>{

                // register user1 successfully
                    
                //  test the name of the event for this function call
                register.logs[0].event.should.be.equal('Registered')
                
    
                //  test that the address in the event is the address we registered
                register.logs[0].args._address.should.be.equal(user1)
    
            })

            it("validates the registration status of a registered address", async()=>{
                const registeredAddress = await vote.registered(user1)

                //  returns true because this address has been registered for voting
                registeredAddress.should.be.equal(true)
            })

            it("validates the non registration status of an unregistered address", async()=>{
                const registeredAddress = await vote.registered(user2)

                //  returns false because this address has not been registered for voting
                registeredAddress.should.be.equal(false)
            })
    
        })

        describe("failed", ()=>{

            it("does not registered an electorate twice", async()=>{

                //  should fail if we try to register the same user
    
                register = await vote.registerVoter(
                    firstName,
                    lastName,
                    middlename,
                    state,
                    nin,
        
                    { from: user1 }
                ).should.be.rejectedWith(EVM_REVERT)
    
    
            })
        })


    })

})