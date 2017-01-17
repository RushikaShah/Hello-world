import {  
    Component,  
    OnInit,  
    ChangeDetectorRef  
} from '@angular/core';  
import {  
    Student  
} from './student';  
import {  
    StudentdataService  
} from './studentdata.service';  
import {  
    Router  
} from '@angular/router';  
@Component({  
    selector: 'app-addstudent',  
    templateUrl: './addstudent.component.html',  
    styleUrls: ['./addstudent.component.css']  
})  
export class AddstudentComponent implements OnInit {  
    model = {  
        rno: 0,  
        name: '',  
        mobile_no: '',  
        student_img: ''  
    };  
    path = '';  
    public file_srcs: string[] = [];  
    public debug_size_before: string[] = [];  
    public debug_size_after: string[] = [];  
    constructor(private changeDetectorRef: ChangeDetectorRef, private studata: StudentdataService, public _route: Router) {}  
    ngOnInit() {}  
    fileChange(input) {  
        this.readFiles(input.files);  
    }  
    readFile(file, reader, callback) {  
        reader.onload = () => {  
            callback(reader.result);  
            this.model.student_img = reader.result;  
            console.log(reader.result);  
        }  
        reader.readAsDataURL(file);  
    }  
    readFiles(files, index = 0) {  
        // Create the file reader  
        let reader = new FileReader();  
        // If there is a file  
        if (index in files) {  
            // Start reading this file  
            this.readFile(files[index], reader, (result) => {  
                // Create an img element and add the image file data to it  
                var img = document.createElement("img");  
                img.src = result;  
                // Send this img to the resize function (and wait for callback)  
                this.resize(img, 250, 250, (resized_jpeg, before, after) => {  
                    // For debugging (size in bytes before and after)  
                    this.debug_size_before.push(before);  
                    this.debug_size_after.push(after);  
                    // Add the resized jpeg img source to a list for preview  
                    // This is also the file you want to upload. (either as a  
                    // base64 string or img.src = resized_jpeg if you prefer a file).  
                    this.file_srcs.push(resized_jpeg);  
                    // Read the next file;  
                    this.readFiles(files, index + 1);  
                });  
            });  
        } else {  
            // When all files are done This forces a change detection  
            this.changeDetectorRef.detectChanges();  
        }  
    }  
    resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {  
        // This will wait until the img is loaded before calling this function  
        return img.onload = () => {  
            // Get the images current width and height  
            var width = img.width;  
            var height = img.height;  
            // Set the WxH to fit the Max values (but maintain proportions)  
            if (width > height) {  
                if (width > MAX_WIDTH) {  
                    height *= MAX_WIDTH / width;  
                    width = MAX_WIDTH;  
                }  
            } else {  
                if (height > MAX_HEIGHT) {  
                    width *= MAX_HEIGHT / height;  
                    height = MAX_HEIGHT;  
                }  
            }  
            // create a canvas object  
            var canvas = document.createElement("canvas");  
            // Set the canvas to the new calculated dimensions  
            canvas.width = width;  
            canvas.height = height;  
            var ctx = canvas.getContext("2d");  
            ctx.drawImage(img, 0, 0, width, height);  
            // Get this encoded as a jpeg  
            // IMPORTANT: 'jpeg' NOT 'jpg'  
            var dataUrl = canvas.toDataURL('image/jpeg');  
            // callback with the results  
            callback(dataUrl, img.src.length, dataUrl.length);  
        };  
    }  
    studentSubmit() {  
        this.studata.addStudent(this.model).subscribe(  
            (data: any) => {  
                this._route.navigate(['/allStudent']);  
            },  
            function(error) {  
                console.log(error);  
            },  
            function() {  
                console.log("On Complete");  
            });  
    }  
}  
In the above code, I have created the filechange method which will be fired when file is selected. I have created two more functions for resizing the file and converting the file to base 64. Finally, on clicking the  "Add Student" button, I am submitting the data using post method and on success, it will navigate back to student display page.


students.component.html 

<div class="container">  
    <div class="row"> <button (click)="addStudent()">Add Student</button> <br/>  
        <table class="table">  
            <thead>  
                <th>RollNo</th>  
                <th>Name</th>  
                <th>Mobile Number</th>  
                <th>Photo</th>  
                <th>Action</th>  
            </thead>  
            <tbody>  
                <tr *ngFor="let item of allStudent ">  
                    <td>{{item.rno}}</td>  
                    <td>{{item.name | uppercase}}</td>  
                    <td>{{item.mobile_no}}</td>  
                    <td><span class="thumbnail"><img src="http://localhost:3000{{item.student_img}}" height="150px" width="150px" /></span></td>  
                    <td><button (click)="delStudent(item)"><span class="glyphicon glyphicon-trash"></span></button> </td>  
                </tr>  
            </tbody>  
        </table>  
    </div>  
</div>  
In this HTML, I am displaying the list of all students.

students.component.ts 

import {  
    Component,  
    OnInit  
} from '@angular/core';  
import {  
    Student  
} from './student';  
import {  
    StudentdataService  
} from './studentdata.service';  
import {  
    Router  
} from '@angular/router';  
@Component({  
    selector: 'app-students',  
    templateUrl: './students.component.html',  
    styleUrls: ['./students.component.css']  
})  
export class StudentsComponent implements OnInit {  
    allStudent: Student[] = [];  
    constructor(private _studata: StudentdataService, private _route: Router) {}  
    ngOnInit() {  
        this._studata.getAllStudent().subscribe(  
            (data: Student[]) => {  
                this.allStudent = data;  
            },  
            function(error) {  
                console.log(error);  
            },  
            function() {  
                console.log("complete");  
            });  
    }  
    addStudent() {  
        this._route.navigate(['/addStudent']);  
    }  
    delStudent(item: Student) {  
        this._studata.deleteStudent(item).subscribe(  
            (data: any) => {  
                this.allStudent.splice(this.allStudent.indexOf(item), 1);  
            },  
            function(error) {  
                console.log(error);  
            },  
            function() {});  
    }  
}  
The above code will loop through the "allStudent" array and display each and every student in HTML.

Add Student


Display Student


Conclusion

This tutorial is in continuation of my Angular 2 series. If you do not understand anything in this article, please go through the other parts of the tutorial. For example, if you are wondering how routing is done, then you can simply find everything here.

Creating Web API Using Node.js And MySQL
Working With Read Operation In Angular 2 Applications
Routing, Validation, And Delete Operations In Angular 2
Angular 2 Angular 2 Application Upload Images
TRENDING UP
01 Four Ways To Get The Most Out Of Microsoft Edge And Benefit From It (And Influence People)
02 Local Functions In C# 7.0
03 Onion Architecture In ASP.NET Core MVC
04 Ref Returns In C# 7.0
05 Google Maps In MVC
06 Literal Improvements In C# 7.0
07 An Easy Way To Understand Joins In SQL Server
08 Deconstruction In C# 7.0
09 ASP.NET MVC 5 - REST Web API Authorization
10 Learning C# (Day 10) - Events In C# (A Practical Approach) View All
Follow @twitterapi
MVPs
MOST VIEWED
LEGENDS
NOW
PRIZES
REVIEWS
SURVEY
CERTIFICATIONS
DOWNLOADS
Hosted By CBeyond Cloud Services
ABOUT USFAQMEDIA KITMEMBERSSTUDENTSLINKS
CONTACT US
PRIVACY POLICY
TERMS & CONDITIONS
SITEMAP
REPORT A BUG
facebooktwittergoogle media
©2017 C# Corner. All contents are copyright of their authors.

