import { Component, OnInit } from '@angular/core';
import { TesseractWorker } from 'tesseract.js';
import { S3UploaderService } from 'src/app/services/s3-uploader.service';


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
  public SDKInitPerce;
  public progressPerce;


  constructor(
    private S3UploaderService: S3UploaderService,
  ) { }

  ngOnInit() {
    this.setInputedImageURL(this.inputedImageURL)
  }

  selectFile(event) {
    this.selectedFileName = event.target.files[0].name;
    this.selectedFiles = event.target.files;
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


  ocrImage() {

    const worker = new TesseractWorker();

    worker.recognize(this.inputedImage)
      .progress(progress => {
        console.log('progress', progress);
        this.progressPerce = progress.progress * 100;
      }).then(result => {
        console.log('result', result);

        this.ocrResult = result.text
        console.log('this.ocrResult:', this.ocrResult)

      });
  }

}
