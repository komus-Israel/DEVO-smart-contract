const { EVM_REVERT } = require('./helper')

const Vote = artifacts.require('./Vote');
require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Vote', ([user1, user2, user3, user4, user5])=>{

    let vote
    let register;
    let firstName;
    let lastName;
    let middlename;
    let state;
    let nin;
    let candidateAPC = "Buhari";
    let candidatePDP = "Jonathan";

   
    beforeEach(async ()=>{
        vote = await Vote.new()

        //  initialize the details of the electorate to be registered

        firstName = 'Israel';
        lastName = 'Timilehin';
        middlename = 'Tope';
        state = 'Oyo';
        nin = '1245454';

        
        register = await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user1 }
        )
    })

    describe("registration of electorates", ()=>{

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

            it("does not register an electorate twice", async()=>{

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

    describe("electorate's vote", ()=>{

        let electorateVote;
        beforeEach(async()=>{

            electorateVote = await vote.voteCandidate(candidateAPC, { from: user1 })
        })

        

        describe("validate the vote status of an address", ()=>{

            it("has voted", async()=>{
                const hasVoted = await vote.validateVote(user1)
                hasVoted.should.be.equal(true)
            })

            it("has not voted", async()=>{
                const hasVoted = await vote.validateVote(user2)
                hasVoted.should.be.equal(false)
            })

        })

        describe("failed vote", ()=>{
            it("rejects vote of unregistered electorates", async()=>{

                //  user2 has not registered so his vote was rejected
                await vote.voteCandidate(candidateAPC, { from: user2 }).should.be.rejectedWith(EVM_REVERT)
            })

            it("rejects vote of an electorate who attempts to vote again", async()=>{

                //  user1 has registered and voted, but he attempted to vote again, so his vote was rejected
                await vote.voteCandidate(candidateAPC, { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })

        describe("vote results and stats", ()=>{

            let apcCandidate;
            let pdpCandidate;

            beforeEach(async()=>{
                apcCandidate = await vote.candidates(candidateAPC)
                pdpCandidate = await vote.candidates(candidatePDP)
            })

            it("returns result of first candidate", async()=>{
                
                console.log(apcCandidate.toString())
                
            })

            it("returns result of the second candidate", async()=>{
                console.log(pdpCandidate.toString())
                
            })

            it("returns total votes", async()=>{

                const totalVotes = Number(apcCandidate.toString()) + Number(pdpCandidate.toString())
                console.log(totalVotes)

            })

            it("returns the total number of registered voters", async()=>{
                const allregisteredElectorates = await vote.noOfRegisteredVoters()

                console.log(allregisteredElectorates)
            })

        })

    })

})