import { Component, OnInit } from '@angular/core';
import { TesseractWorker } from 'tesseract.js';
import { S3UploaderService } from 'src/app/services/s3-uploader.service';
import { MessagerService } from '../services/messager.service';



@Component({
  selector: 'app-image-ocr',
  templateUrl: './image-ocr.component.html',
  styleUrls: ['./image-ocr.component.css']
})
export class ImageOcrComponent implements OnInit {


  public selectedFiles: FileList;
  public selectedFileName: string = "Choose a file";
  public selectedPath: String;

  public inputedImage = new Image();
  public inputedImageURL = "https://fakeimg.pl/350x350/282828/EAE0D0/?text= No Image"
  public ocrResult;
  public progressPerce: Number = 0;
  public isRecognizing: Boolean = false;



  constructor(
    private S3UploaderService: S3UploaderService,
    private MessagerService: MessagerService,
  ) { }

  ngOnInit() {
    this.setInputedImageURL(this.inputedImageURL)

  }

  selectFile(event) {
    this.selectedFileName = event.target.files[0].name;
    this.selectedFiles = event.target.files;
    this.MessagerService.openSnackBar("One File Seclected", 1, null);
  }

  async uploadImage() {
    const file = this.selectedFiles.item(0);
    const URL = await this.S3UploaderService.uploadFile(file);
    this.setInputedImageURL(URL);
    console.log("After upload, URL:", URL);

  }

  setInputedImageURL(_url) {
    this.inputedImage.src = _url;

  }

  exampleImage(_imageNo) {
    const imagePath = '../../assets/images/handwritten' + _imageNo + '.jpg'
    this.inputedImage.src = imagePath
  }


  ocrImage() {

    this.isRecognizing = true;
    this.ocrResult = null;
    this.MessagerService.openSnackBar("Preparing for recognizing..", null, null);

    const worker = new TesseractWorker();
    worker.recognize(this.inputedImage)
      .progress(progress => {
        console.log('progress', progress);

        if (progress.status === "recognizing text") {

          this.MessagerService.closeSnackBar();
          this.progressPerce = Math.round(progress.progress * 100);

        } else {
          return
        }



      }).then(result => {
        console.log('result', result);
        this.MessagerService.openSnackBar("The Image has Recongized", 1, null);

        this.ocrResult = result.text
        console.log('this.ocrResult:', this.ocrResult)
        this.progressPerce = 0;
        this.isRecognizing = false;


      });
  }

}
