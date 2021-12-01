from flask import Flask, request, json, Response
from pymongo import MongoClient
import logging as log
from datetime import date

app = Flask(__name__)


class MongoAPI:
    def __init__(self):
        log.basicConfig(level=log.DEBUG, format='%(asctime)s %(levelname)s:\n%(message)s\n')
        self.client = MongoClient("mongodb://admin:admin@database:27017/")

        database ='pi-iv'
        collection = 'products'

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
        group = {"_id": "$_id",
                 "totalDocuments":{"$sum":1}} 
        group1 = {"_id": "$totalDocuments",
                 "count":{"$sum":1}} 
        
        pipeline = [ {"$group": group}, {"$group": group1}]
        output = {"totalDocuments":item["count"] for item in self.collection.aggregate(pipeline)}
        
        dateConvert = {
            "$addFields":{
                "dia":{"$toInt":"$createdAt.day"},
                "mes":{"$toInt":"$createdAt.month"},
                "ano":{"$toInt":"$createdAt.year"}
            }
        }
        
        match = {"$and":[{"dia":date.today().day},{"mes":date.today().month}, {"ano":date.today().year}]}
        
        pipeline = [ dateConvert,{"$match":match},{"$group": group}, {"$group": group1}]
        for item in self.collection.aggregate(pipeline):
            output["totalDocumentsToday"] = item["count"] 
            
        group = {"_id": "$sku",
                 "totalDocuments":{"$sum":1}} 
        
        pipeline = [ {"$group": group}, {"$group": group1}]
        for item in self.collection.aggregate(pipeline):
            output["totalProducts"] = item["count"] 
            
        pipeline = [ dateConvert,{"$match":match},{"$group": group}, {"$group": group1}]
        for item in self.collection.aggregate(pipeline):
            output["totalProductsToday"] = item["count"]

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


if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')