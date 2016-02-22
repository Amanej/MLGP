models = new Mongo.Collection('models');

Modelpictures = new FS.Collection("ModelPictures", {
  stores: [new FS.Store.FileSystem("ModelPictures", {path: '~/uploads'})]
});

Modelimages = new Mongo.Collection('modelimages');


if(Meteor.isClient) {

  Template.models.helpers({
    'model': function(){
      return models.find();
    },
    shortendesc: function(){
      return this.description.substr(0,140)+'....';
    },
    'modelimage': function(id){
      var imgurl = Modelimages.findOne({modelid: id}).image;
      return imgurl;
    },
    'modelpictures': function() {
      return Modelpictures.find();
    }
  });

  Template.models.events({
    //$('fileupload').fileupload({
    //url: '/path/to/upload/handler.json',
    //sequentialUploads: true
    //});
    // Add file info
  });

  Template.newmodel.events({
    'submit .new-model': function(event) {
      event.preventDefault();

      var newname =  event.target.name.value;
      var newdescription = event.target.description.value;
      var category = event.target.category.value;
      var file = $('#modelimage').get(0).files[0];

      models.insert({
        name: newname,
        userId: Meteor.userId(),
        description: newdescription,
        category: category,
        link: 'model.stl'
      }, function(err, id) {

        console.log("model id is: "+id);

        console.log(file);

        if(file) {
          fsFile = new FS.File(file);

          Modelpictures.insert(fsFile, function(err, result){
            if(err){
              throw new Meteor.Error(err);
            } else {
              var imageLocation = '/uploads'+result._id;

              Modelimages.insert({
                userId: Meteor.userId(),
                modelid: id,
                username: Meteor.user().username,
                image: imageLocation
              });
            }
          });
        }

        return false;
      });

      // Koble riktig id opp mot riktig modell-bilde
      // Koble fil/filer opp mot modell

      console.log(event);
      console.log(category);
    }
  })

}
