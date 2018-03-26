const appointmentsSql = require('../sql/appointments');
const fs = require('fs');
const rankingsSql = require('../sql/rankings');
const reviewsSql = require('../sql/reviews');
const score = require('../utils/score');
const usersSql = require('../sql/users');

module.exports = {
    import: (pool, filePath) => {
      fs.stat(filePath, (error, stats) => {
          if(error || !stats.isFile()) {
            return console.log('Could not find ' + filePath);
          }

          const appointmentsSqlApi = new appointmentsSql(pool);
          const rankingsSqlApi = new rankingsSql(pool);
          const reviewsSqlApi = new reviewsSql(pool);
          const usersSqlApi = new usersSql(pool);

          const columns =  {
            'rating': 0,
            'sitter_image': 1,
            'end_date': 2,
            'text': 3,
            'owner_image': 4,
            'dogs': 5,
            'sitter': 6,
            'owner': 7,
            'start_date': 8,
            'sitter_phone': 9,
            'sitter_email': 10,
            'owner_phone': 11,
            'owner_email': 12
          };

          //stream lines of csv
          const lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(filePath)
          });

          //flag to allow us to skip first row of csv containing headers
          let isDataStart = false;

          lineReader.on('line', (line) => {
            if(isDataStart) {
              let items = line.split(',');

              ImportLine(appointmentsSqlApi, rankingsSqlApi, reviewsSqlApi, usersSqlApi,
                items[columns['rating']], items[columns['sitter_image']], items[columns['end_date']],
                items[columns['text']], items[columns['owner_image']], items[columns['dogs']],
                items[columns['sitter']], items[columns['owner']], items[columns['start_date']],
                items[columns['sitter_phone']], items[columns['sitter_email']], items[columns['owner_phone']],
                items[columns['owner_email']]);
            }
            isDataStart = true;
          });
      });
    }
}

function ImportLine(appointmentsSqlApi, rankingsSqlApi, reviewsSqlApi, usersSqlApi,
  rating, sitterImage, endDate, text, ownerImage, dogs, sitter,
  owner, startDate, sitterPhone, sitterEmail, ownerPhone, ownerEmail) {
    //add sitter
    usersSqlApi.addUser(sitter, sitterEmail, sitterPhone, sitterImage, 1, score.calculateScore(sitter), (error) => {
        if(error) {
          console.log('Could not add sitter ' + sitterEmail, error);
        }

        //add owner
        usersSqlApi.addUser(owner, ownerEmail, ownerPhone, ownerImage, 0, null, (error) => {
            if(error) {
              console.log('Could not add owner ' + ownerEmail, error);
            }

            //add appointment
            appointmentsSqlApi.addAppointmentByEmailAddresses(sitterEmail, ownerEmail, startDate,
              endDate, dogs, (error) => {
                if(error) {
                  console.log('Could not add appointment', error);
                }

                //add review
                reviewsSqlApi.addReviewByEmailAddresses(sitterEmail, ownerEmail, rating, text, (error) => {
                    if(error) {
                      console.log('Could not add review', error);
                    }

                    //calculate ranking
                    rankingsSqlApi.updateRankingByEmailAddress(sitterEmail, (error) => {
                      if(error) {
                        console.log('Could not update ranking for ' + sitterEmail, error);
                      }
                    });
                });
            });
        });
    });
}
