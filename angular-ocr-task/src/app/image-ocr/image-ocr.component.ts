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
  public isExampleImage: Boolean = false;

  public inputedImage = new Image();
  public inputedImageURL = "https://fakeimg.pl/350x350/282828/EAE0D0/?text= No Image"
  public ocrResult;
  public progressPerce: Number = 0;
  public progressMessage: String;
  public isRecognizing: Boolean = false;

  public imageUploadingProgressMessage: String;
  public isImageUploading: Boolean = false;



  constructor(
    private S3UploaderService: S3UploaderService,
    private MessagerService: MessagerService,
  ) { }

  ngOnInit() {
    this.setInputedImageURL(this.inputedImageURL)

  }

  selectFile(event) {

    if (event.target.files[0].size > 2048000) {
      this.MessagerService.openSnackBar("This image should less than 2MB, Please try another Image", 3, null)
      return
    } else {

      if (event.target.files[0].type !== "image/png" && event.target.files[0].type !== "image/jpeg") {
        this.MessagerService.openSnackBar("Selected Rejected, PNG OR JPGE Only", 3, null);
        return
      } else {
        this.ocrResult = null;
        this.setInputedImageURL("https://fakeimg.pl/350x350/282828/EAE0D0/?text= Push Upload");
        this.selectedFileName = event.target.files[0].name;
        this.selectedFiles = event.target.files;
        this.MessagerService.openSnackBar("One File Seclected", 3, null);
      }


    }

  }

  async uploadImage() {
    this.ocrResult = null;
    this.isImageUploading = true;
    this.imageUploadingProgressMessage = "The Image is uploading..."
    const file = this.selectedFiles.item(0);
    const URL = await this.S3UploaderService.uploadFile(file);
    this.setInputedImageURL(URL);
    // console.log("After upload, URL:", URL);

  }

  setInputedImageURL(_url) {
    this.inputedImage.src = _url;
    this.isImageUploading = false;
    this.ocrResult = null;
  }

  exampleImage(_imageNo) {
    const imagePath = '../../assets/images/example' + _imageNo + '.jpg'
    // this.inputedImage.src = imagePath
    this.setInputedImageURL(imagePath)
  }


  ocrImage() {

    this.isRecognizing = true;
    this.ocrResult = null;
    this.progressMessage = "Preparing for recognizing..."

    const worker = new TesseractWorker();
    worker.recognize(this.inputedImage)
      .progress(progress => {
        // console.log('progress', progress);

        if (progress.status === "recognizing text") {

          this.MessagerService.closeSnackBar();
          this.progressPerce = Math.round(progress.progress * 100);

          this.progressMessage = "Progress:" + this.progressPerce + "%"

        } else {
          return
        }



      }).then(result => {
        console.log('result', result);
        this.MessagerService.openSnackBar("The Image has Recongized", 2, null);

        this.ocrResult = result.text
        console.log('this.ocrResult:', this.ocrResult)
        this.progressPerce = 0;
        this.isRecognizing = false;
        this.progressMessage = null;


      });
  }

}
