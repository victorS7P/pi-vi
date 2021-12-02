from flask import Flask, request, json, Response, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import logging as log
from datetime import date

app = Flask(__name__)
CORS(app)

class MongoAPI:
    def __init__(self):
        log.basicConfig(level=log.DEBUG, format='%(asctime)s %(levelname)s:\n%(message)s\n')
        self.client = MongoClient("mongodb://admin:admin@database:27017/")

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
        group = {"_id": "$category"} 
        pipeline = [ {"$group": group}]
        output = [item["_id"] for item in self.collection.aggregate(pipeline)]
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
    
    def read_products_page(self): 
        offset = int(request.args["offset"])
        limit = int(request.args["limit"])
        
        starting_id =  list(self.collection.aggregate([{"$group": {"_id": "$_id"}}, {"$sort":{"_id._id":1}}]))
        last_id = starting_id[offset]["_id"]
        
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
        
        match = {"_id":{"$gte": last_id}}

        output = list()
        pipeline = [{"$match":match},{"$group": group},{"$group": group1},{"$sort":{"_id.id":1}},{"$project":project},{"$limit":limit}]
        for item in self.collection.aggregate(pipeline):
            output.append({"product":item})
        next_page = offset + limit
        prev_url = offset - limit
        return jsonify({"products": output, "prev_page":prev_url, "next_page":next_page}) 
    
    def read_category_page(self):
        offset = int(request.args["offset"])
        limit = int(request.args["limit"])
        category = request.args["category"]
        
        starting_id =  list(self.collection.aggregate([{"$group": {"_id": "$_id"}}, {"$sort":{"_id._id":1}}]))
        last_id = starting_id[offset]["_id"]
        
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
        
        match = {"_id":{"$gte": last_id}}
        match2 = {"_id.category":category}
        
        output = list()
        pipeline = [{"$match":match},{"$group": group},{"$group": group1},{"$match":match2},{"$sort":{"_id.id":1}},{"$project":project},{"$limit":limit}]
        for item in self.collection.aggregate(pipeline):
            output.append({"product":item})
        next_page = offset + limit
        prev_url = offset - limit
        return jsonify({"products": output, "prev_page":prev_url, "next_page":next_page}) 
    
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

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')