import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
import { MessagerService } from './messager.service';

// import { MatSnackBar } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class S3UploaderService {

  constructor(
    public MessagerService: MessagerService,

  ) { }

  private s3AccessKeyId = `${environment.s3AccessKeyId}`;
  private s3SecretAccessKey = `${environment.s3SecretAccessKey}`;



  uploadFile(file) {

    return new Promise((resolve, reject) => {

      const contentType = file.type;
      const bucket = new S3(
        {
          accessKeyId: this.s3AccessKeyId,
          secretAccessKey: this.s3SecretAccessKey,
          region: 'us-east-1'
        }
      );

      const timeInMs = Date.now();
      const params = {
        Bucket: 'ocr-task',
        Key: timeInMs + "-" + file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: contentType
      };


      bucket.upload(params).on('httpUploadProgress', function (evt) {
        // console.log("S3 Uploading " + evt.loaded + ' of ' + evt.total + ' Bytes');
        const messageText = "S3 Uploading " + evt.loaded + ' of ' + evt.total + ' Bytes';

      }).send(function (err, data) {
        if (err) {
          // console.log('There was an error uploading your file: ', err);
          reject(err);
        }
        // console.log('Successfully uploaded file.', data);

        resolve(data.Location);

      });

      // bucket.upload(params, function (err, data) {
      //   if (err) {
      //     reject(err);
      //   }
      //   resolve(data.Location);
      // });



    })


  }


}
