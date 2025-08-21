
const { expect } = require('chai')
const Catagary = require('../model/Categary');
const { createCategary, categaryPage } = require('../controller/Categary/Categary');
const sinon = require('sinon');


describe('Category ', () => {

    afterEach(() => {
        if (res) {
            console.log("👉 status called with:", res.status.args);
            console.log("👉 json called with:", res.json.getCalls().map(c => c.args));
        }
        sinon.restore()
    });
    
    // create the category 
    it('should create a new category', async () => {

        // fake res 
        req = {
            body : { 
                name : 'test category',
                description : 'test description'
            }
        }

        res = {
            status : sinon.stub().returnsThis(),
            json : sinon.stub()
        }

        await createCategary(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            category: {
                name: 'test category',
                description: 'test description',
            }
        })).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,
            message: 'Category created successfully.',
        })).to.be.true;
    })

    // get the category by id

    it('should return category by ID', async () => {
        // fake req and res
        req = {
            body: {
                catagaryId: "68a59bac2ae27f3b2fcc4d47"
            }
        }

        res = {
            status : sinon.stub().returnsThis(),
            json : sinon.stub()
        }

        // stub the DB 
        sinon.stub(Catagary, 'findById').returns({
            populate: sinon.stub().returnsThis(),
            exec : sinon.stub().resolves({    
                _id : '68a59bac2ae27f3b2fcc4d47',
                name : 'get test category',
                description : 'get test description',
                courses: []
            }) 
        })

        await categaryPage(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success : true,
            message : 'Categary Page Data.',
            // data : {
            //      _id : '68a59bac2ae27f3b2fcc4d47',
            //     name : 'get test category',
            //     description : 'get test description',
            //     courses: []
            // }
        })).to.be.true;
    })
})