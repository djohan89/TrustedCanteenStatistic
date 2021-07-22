/* ===== Đầu: Phần chức năng kiểm tra loại file ===== */
    $('#fileup').change(function(){
    //here we take the file extension and set an array of valid extensions
        var res=$('#fileup').val();
        var arr = res.split("\\");
        var filename=arr.slice(-1)[0];
        filextension=filename.split(".");
        filext="."+filextension.slice(-1)[0];
        valid=[".xls",".xlsx"];
    //if file is not valid we show the error icon, the red alert, and hide the submit button
        if (valid.indexOf(filext.toLowerCase())==-1){
            $( ".imgupload" ).hide("slow");
            $( ".imgupload.ok" ).hide("slow");
            $( ".imgupload.stop" ).show("slow");
          
            $('#namefile').css({"color":"red","font-weight":700});
            $('#namefile').html("File "+filename+" is not  pic!");
            
            $( "#submitbtn" ).hide();
            $( "#fakebtn" ).show();
        }else{
            //if file is valid we show the green alert and show the valid submit
            $( ".imgupload" ).hide("slow");
            $( ".imgupload.stop" ).hide("slow");
            $( ".imgupload.ok" ).show("slow");
          
            $('#namefile').css({"color":"green","font-weight":700});
            $('#namefile').html(filename);
          
            $( "#submitbtn" ).show();
            $( "#fakebtn" ).hide();
        }
    });
/* ===== Cuối: Phần chức năng kiểm tra loại file ===== */



    // Datatable: Phần hiển thị thông tin đầu ra
    $('#example').DataTable();



/* ===== Đầu: Phần chức năng đọc file excel ===== */
    var selectedFile;
    document
        .getElementById("fileup")
        .addEventListener("change", function(event) {
            selectedFile = event.target.files[0];
        });
    document
        .getElementById("submitbtn")
        .addEventListener("click", function() {
            if (selectedFile) {
                console.log("hiii");
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var data = event.target.result;

                    var workbook = XLSX.read(data, {
                        type: "binary"
                    });
                    workbook.SheetNames.forEach(sheet => {
                        let rowObject = XLSX.utils.sheet_to_row_object_array(
                            workbook.Sheets[sheet]
                        );
                        let jsonObject = JSON.stringify(rowObject);
                        document.getElementById("jsonData").innerHTML = jsonObject;
                        
                        // console đoạn json dưới dạng string
                        console.log(jsonObject);

                        // console đoạn json dưới dạng đối tượng
                        console.log(rowObject);

                        /*view_json_1(rowObject);*/
                        view_json_2(rowObject);



                        // Thay thế dữ liệu mới lấy được (XL_row_object) truyền vào datatable (báo cáo 1)
                        example.clear().draw();
                        example.rows.add(rowObject); // Add new data
                        example.columns.adjust().draw(); // Redraw the DataTable
                    });
                };
                fileReader.readAsBinaryString(selectedFile);
            }
        });

    /*function view_json_1(rowObject) {
        var abc = document.getElementById("content");
        var count = 0;
        var insert_html = '';

        for (i = 0; i < rowObject.length; i++) {
            if (typeof(rowObject[i]["Name"]) != "undefined") {
                count++;
            }
        }
        console.log(count);
    }*/

    function view_json_2(rowObject) {
        var abc = document.getElementById("content");
        var insert_html = '';
        var button_id = 1;

        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        var groubedByTeam = groupBy(rowObject, 'Company');

        console.log("Phân chia theo mục Company:");
        console.log("");
        console.log(groubedByTeam);
        console.log(typeof(groubedByTeam));

        // Vòng lặp đọc mảng json khi có key
        for(var k in groubedByTeam) {
            insert_html +=  '<div id="' + button_id + '">' + 
                                '<button>' + k + ' ' + groubedByTeam[k].length + '</button>' +
                            '</div>';
            console.log(k, groubedByTeam[k].length);

            button_id++;
        }
        abc.innerHTML = insert_html;
        
    }
/* ===== Cuối: Phần chức năng đọc file excel ===== */