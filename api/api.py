from flask import Flask, request, json, Response, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import logging as log
from datetime import date
from datetime import timedelta

app = Flask(__name__)
CORS(app)

class MongoAPI:
    def __init__(self):
        log.basicConfig(level=log.DEBUG, format='%(asctime)s %(levelname)s:\n%(message)s\n')
        self.client = MongoClient("mongodb+srv://Danilo:1234@Pokemon.m0ph5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

        database ='Pokemon'
        collection = 'pokemons'

        cursor = self.client[database]
        self.collection = cursor[collection]

    def read(self):
        log.info('Reading All Data')
        documents = self.collection.find()
        output = [{item: data[item] for item in data if item != '_id'} for data in documents]
        return output
    
    def read_categories(self):
        log.info('Reading Categories')
        group = {"_id": "$category", "products": { "$sum": 1 }} 
        pipeline = [ {"$group": group}]
        output = [{"category": item["_id"], "products": item["products"]} for item in self.collection.aggregate(pipeline)]
        return output
    
    def read_info(self):
        log.info('Reading Info')
        group = {"_id": "$_id"} 
        group1 = {"_id": "$_id._id",
                 "count":{"$sum":1}} 
        
        pipeline = [ {"$group": group}, {"$group": group1}]
        output = {"totalDocuments":item["count"] for item in self.collection.aggregate(pipeline)}
        
        dateConvert = {
            "$addFields":{
                "day":{"$toInt":"$createdAt.day"},
                "month":{"$toInt":"$createdAt.month"},
                "year":{"$toInt":"$createdAt.year"}
            }
        }
        
        match = {"$and":[{"_id.day":date.today().day},{"_id.month":date.today().month}, {"_id.year":date.today().year}]}
        
        group = {"_id": {"id":"$_id","day":"$day",
                  "month":"$month",
                  "year":"$year"}} 
        
        group1 = {"_id": "$_id.id",
                  "count":{"$sum":1}}
        
        pipeline = [dateConvert, {"$group": group}, {"$match":match}, {"$group": group1}]
        for item in self.collection.aggregate(pipeline):
            output["totalDocumentsToday"] = item["count"]
            
        group = {"_id": "$sku"} 
        group1 = {"_id": "$_id.sku",
                 "count":{"$sum":1}} 
        
        pipeline = [ {"$group": group}, {"$group": group1}]
        for item in self.collection.aggregate(pipeline):
            output["totalProducts"] = item["count"] 
            
        group = {"_id": {"id":"$sku","day":"$day",
                "month":"$month",
                "year":"$year"}} 
        
        group1 = {"_id": "$_id.sku",
                  "totalSkus":{"$sum":1}}
            
        pipeline = [dateConvert, {"$group": group}, {"$match":match}, {"$group": group1}]
        for item in self.collection.aggregate(pipeline):
            output["totalProductsToday"] = item["totalSkus"]
            
        group = {"_id": {"id":"$_id","nome":"$name","sku":"$sku","category":"$category", "preco":"$price"
                ,"day":"$createdAt.day"
                ,"month":"$createdAt.month"
                ,"year":"$createdAt.year"}} 
        
        group1= {"_id": {"id":"$_id.id","name":"$_id.nome","sku":"$_id.sku","category":"$_id.category"},
                 "PriceHistory":{"$push":{"price":"$_id.preco","date":{"year":"$_id.year","month":"$_id.month","day":"$_id.day"}}}} 

        project = {  
            "_id":0,
            "nome":"$_id.name",
            "sku": "$_id.sku",
            "category": "$_id.category",
            "PriceHistory":"$PriceHistory"
        }
        
        pipeline = [{"$group": group}, {"$group": group1},{"$sort":{"_id.id":-1}}, {"$project":project}]
        for item in self.collection.aggregate(pipeline):
            output["lastDocument"] = item
            break
        
        return output 

    def build_product(self, sku):
        cursor = self.collection.aggregate([
            {
                '$match': {
                    'sku': sku
                },
            },

            {
                '$group': {
                    '_id': {
                        'day': '$createdAt.day',
                        'month': '$createdAt.month',
                        'year': '$createdAt.year',
                        'price': '$price'
                    },
                    'sku':  { '$first': '$sku' },
                    'name': { '$first': '$name' },
                    'category': { '$first': '$category' }
                }
            },

            {
                '$group': {
                    '_id': '$sku',
                    "PriceHistory": {
                        "$push": {
                            "price": "$_id.price",
                            "date": {
                                "year":"$_id.year",
                                "month":"$_id.month",
                                "day":"$_id.day"
                            }
                        }
                    },
                    'sku':  { '$first': '$sku' },
                    'nome': { '$first': '$name' },
                    'category': { '$first': '$category' }
                }
            }
        ])

        return dict(list(cursor)[0])
    
    def read_products_page(self): 
        page = int(request.args["page"])

        limit = 20
        offset = ((page - 1) * limit)
        
        cursor = self.collection.aggregate([
            {
                "$facet": {
                    "edges": [
                        { "$skip": offset },
                        { "$limit": limit }
                    ],

                    "pageInfo": [
                        {
                            "$group": {
                                "_id": "sku",
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            }
        ])

        total = 0
        products = []
        for document in cursor:
            total = list(document['pageInfo'])[0]['count']
            for p in document["edges"]:
                products.append(self.build_product(p['sku']))

        return jsonify({"products": products, "lastPage": (total // limit) + 1}) 
    
    def read_category_page(self):
        page = int(request.args["page"])
        category = request.args["category"]

        limit = 20
        offset = ((page - 1) * limit)
        
        cursor = self.collection.aggregate([
            {
                "$match": {
                    'category': category
                }
            },
            {
                "$facet": {
                    "edges": [
                        { "$skip": offset },
                        { "$limit": limit }
                    ],

                    "pageInfo": [
                        {
                            "$group": {
                                "_id": "sku",
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            }
        ])

        total = 0
        products = []
        for document in cursor:
            total = list(document['pageInfo'])[0]['count']
            for p in document["edges"]:
                products.append(self.build_product(p['sku']))

        return jsonify({"products": products, "lastPage": (total // limit) + 1}) 
    
    def read_product(self):
        sku = request.args["sku"]
        
        group = {"_id": {"nome":"$name","sku":"$sku","category":"$category", "preco":"$price"
        ,"day":"$createdAt.day"
        ,"month":"$createdAt.month"
        ,"year":"$createdAt.year"}} 

        group1= {"_id": {"name":"$_id.nome","sku":"$_id.sku","category":"$_id.category"},
                 "PriceHistory":{"$push":{"price":"$_id.preco","date":{"year":"$_id.year","month":"$_id.month","day":"$_id.day"}}}} 
        
        project = {  
            "_id":0,
            "nome":"$_id.name",
            "sku": "$_id.sku",
            "category": "$_id.category",
            "PriceHistory":"$PriceHistory"
        }
        
        match = {"_id.sku":sku}
        
        pipeline = [{"$group": group},{"$group": group1},{"$match":match},{"$project":project}]
        output = []
        for item in self.collection.aggregate(pipeline):
            output.append(item)

        if (len(output)):
            return output[0]
        else:
            return None

    def match_product(self):
        name = request.args["name"]

        cursor = self.collection.aggregate([
            {
                '$match': {
                    '$text': { '$search': name },
                    'name': { '$ne': name }
                }
            },
            {
                '$sort': {
                    'score': { '$meta': "textScore" }
                }
            },
            {
                '$project': {
                    "_id": "$$REMOVE",
                    "name": "$$REMOVE",
                    "sku": "$sku"
                }
            },
            {
                '$group': {
                    '_id': '$sku',
                    'sku': { '$first': '$sku' }
                }
            },
            {
                '$limit': 5
            }
        ])

        products_list = []
        for p in cursor:
            products_list.append(self.build_product(p['sku']))


        return products_list
        
    def read_product_sale(self):
        lyear,lmonth, lday = str(date.today()-timedelta(1)).split("-")
        year, month, day = str(date.today()).split("-")
        
        group = {"_id": {"nome":"$name","sku":"$sku","category":"$category", "preco":"$price"
        ,"day":"$createdAt.day"
        ,"month":"$createdAt.month"
        ,"year":"$createdAt.year"}} 

        group1= {"_id": {"name":"$_id.nome","sku":"$_id.sku","category":"$_id.category"},
                 "PriceHistory":{"$push":{"price":"$_id.preco","date":{"year":"$_id.year","month":"$_id.month","day":"$_id.day"}}}}
        
        group2 = {"_id": {"name":"$_id.nome","sku":"$_id.sku","category":"$_id.category", "PriceHistory":"$PriceHistory", "prices":"$PriceHistory.price"}}
        
        project = {  
            "_id":0,
            "nome":"$_id.name",
            "sku": "$_id.sku",
            "category": "$_id.category",
            "PriceHistory":"$_id.PriceHistory",
            "sale":{"$subtract":[{"$arrayElemAt":["$_id.prices", -2]},{"$arrayElemAt":["$_id.prices", -1]}]}
        }
        
        match={"$and":[{"PriceHistory.date.day":day}, {"PriceHistory.date.month":month}, {"PriceHistory.date.year":year}]}
        
        pipeline = [{"$group": group},{"$group": group1},{"$match":match},{"$group": group2}, {"$project": project},{"$sort":{"sale":-1} },{"$limit":10}]
        output = []
        for item in self.collection.aggregate(pipeline):
            output.append(item)
        return output
        
    
def error():
    return Response(response=json.dumps({"Error": "Please provide connection information"}),
                        status=400,
                        mimetype='application/json')
    
@app.route('/')
def base():
    return Response(response=json.dumps({"Status": "UP"}),
                    status=200,
                    mimetype='application/json')

@app.route('/mongodb', methods=['GET'])
def mongo_read():    
    obj1 = MongoAPI()
    response = obj1.read()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')
    
@app.route('/categories', methods=['GET'])
def categories():    
    obj1 = MongoAPI()
    response = obj1.read_categories()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

@app.route('/info', methods=['GET'])
def info():    
    obj1 = MongoAPI()
    response = obj1.read_info()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

@app.route('/products_page', methods=['GET'])
def products_page():    
    obj1 = MongoAPI()
    return obj1.read_products_page()

@app.route('/products_category_page', methods=['GET'])
def products_category_page():    
    obj1 = MongoAPI()
    return obj1.read_category_page()

@app.route('/product', methods=['GET'])
def product():    
    obj1 = MongoAPI()
    response = obj1.read_product()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')
    
@app.route('/products/sale', methods=['GET'])
def product_sale():    
    obj1 = MongoAPI()
    response = obj1.read_product_sale()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

@app.route('/products/match', methods=['GET'])
def match_prduct():
    obj1 = MongoAPI()
    response = obj1.match_product()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')