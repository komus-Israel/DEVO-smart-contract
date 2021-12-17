const { EVM_REVERT } = require('./helper')

const Vote = artifacts.require('./Vote');
require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Vote', ([user1, user2, user3, user4, user5, user6, user7, candidate1, candidate2, candidate3])=>{

    let vote
    let register;
    let firstName;
    let lastName;
    let middlename;
    let state;
    let nin;
    let candidateAPC = candidate1;
    let candidatePDP = candidate2;
    

   
    beforeEach(async ()=>{
        vote = await Vote.new()

        //  initialize the details of the electorate to be registered

        firstName = 'Israel';
        lastName = 'Timilehin';
        middlename = 'Tope';
        state = 'Oyo';
        nin = '1245454';

        //  register user1 - user7 except user2 for testing purposes

        
        register = await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user1 }
        )


        await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user3 }
        )

        await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user4 }
        )

        await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user5 }
        )

        await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user6 }
        )

        await vote.registerVoter(
            firstName,
            lastName,
            middlename,
            state,
            nin,

            { from: user7 }
        )
    })

    describe("deployment", ()=>{
        it("sets the address of the deployer", async()=>{
            const owner = await vote.owner()
            console.log(owner)
           //console.log(test)
        })
        
    })

    describe("registration of electorates", ()=>{

        describe("success", ()=>{

            it("registers successfully", async()=>{

                // register user1 successfully
                    
                //  test the name of the event for this function call
                register.logs[0].event.should.be.equal('ElectorateRegistered')
                
    
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

    describe("register candidate", ()=>{

        describe("success status", ()=>{
            it("registers a candidate successfully", async()=>{
                await vote.registerCandidates(candidateAPC, 'Ajimobi', 'vdfbdfbdfb', {from: user1})
            })
    
            it("fails to register a candidate by an unauthorized address", async()=>{
                await vote.registerCandidates(candidateAPC, 'Ajimobi', 'vdfbdfbdfb', {from: user2}).should.be.rejectedWith(EVM_REVERT)
            })
    
            it("fails to register a candidate more than once", async()=>{
                await vote.registerCandidates(candidateAPC, 'Ajimobi', 'vdfbdfbdfb', {from: user1})
            })
        })

        describe("candidates data", ()=>{

            beforeEach(async()=>{
                await vote.registerCandidates(candidateAPC, 'Ajimobi', 'vdfbdfbdfb', {from: user1})
            })

            it("gets the candidates data", async()=>{
                const candidateData = await vote.registeredCandidatesData(candidateAPC)
                console.log(candidateData)
            })

            it("gets the array of registered candidates", async()=>{
                const arrayOfCandidates = await vote.getAllCandidates()
                console.log(arrayOfCandidates)
            })
        })

        


    })

    describe("electorate's vote", ()=>{

        let electorateVote1
        let electorateVote3
        let electorateVote4
        let electorateVote5
        let electorateVote6
        
        beforeEach(async()=>{

            //register the party
            await vote.registerCandidates(candidateAPC, 'Ajimobi', 'vdfbdfbdfb', {from: user1})
            await vote.registerCandidates(candidatePDP, 'Akala', 'vdfbdfbdfb', {from: user1})

            electorateVote1 = await vote.voteCandidate(candidateAPC, { from: user1 })
            electorateVote3 = await vote.voteCandidate(candidateAPC, { from: user3 })
            electorateVote4 = await vote.voteCandidate(candidatePDP, { from: user4 })
            electorateVote5 = await vote.voteCandidate(candidatePDP, { from: user5 })
            electorateVote6 = await vote.voteCandidate(candidatePDP, { from: user6 })
        })

        describe("vote event", ()=>{
            it("emits event for electorate1 who voted APC", async()=>{

                //  event must validate that electorate1 voted for APC
                electorateVote1.logs[0].event.should.be.equal('VoteCandidate')
                electorateVote1.logs[0].args._candidate.should.be.equal(candidateAPC)
            })

            it("emit event for electorate4 who voted PDP", async()=>{

                 //  event must validate that electorate4 voted for PDP
                electorateVote4.logs[0].event.should.be.equal('VoteCandidate')
                electorateVote4.logs[0].args._candidate.should.be.equal(candidatePDP)

            })
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

            it("rejects vote of an electorate who attempted to vote again", async()=>{

                //  user1 has registered and voted, but he attempted to vote again, so his vote was rejected
                await vote.voteCandidate(candidateAPC, { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })


            it("rejects vote for non registered candidates", async()=>{
                await vote.voteCandidate(candidate3, {from: user7}).should.be.rejectedWith(EVM_REVERT)
            })
        })

        describe("vote results and stats", ()=>{

            let apcCandidate;
            let pdpCandidate;

            beforeEach(async()=>{
                apcCandidate = await vote.voteCount(candidateAPC)
                pdpCandidate = await vote.voteCount(candidatePDP)
            })

            it("returns result of APC candidate", async()=>{
                
              apcCandidate.toString().should.be.equal('2')
                
            })

            it("returns result of the PDP candidate", async()=>{
                pdpCandidate.toString().should.be.equal('3')
                
            })

            it("returns total votes", async()=>{

                const totalVotes = Number(apcCandidate.toString()) + Number(pdpCandidate.toString())
                totalVotes.should.be.equal(5)

            })

            it("returns the total number of registered voters", async()=>{
                const allregisteredElectorates = await vote.noOfRegisteredVoters()

                allregisteredElectorates.toString().should.be.equal('6')
            })

        })

    })

})