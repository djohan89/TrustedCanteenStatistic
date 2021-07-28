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
                console.log("Hello Hi Bông Dua Canh thiu không ai múc!!!");
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
                        // document.getElementById("jsonData").innerHTML = jsonObject;
                        
                        // console đoạn json dưới dạng string
                        // console.log(jsonObject);

                        // console đoạn json dưới dạng đối tượng
                        // console.log(rowObject, typeof(rowObject), rowObject.Name);

                        /*view_json_1(rowObject);*/
                        view_json_employee(rowObject); // Gọi và đẩy dữ liệu đến function view_json_employee
                    });
                };
                fileReader.readAsBinaryString(selectedFile);
            }
        });

    function view_json_employee(rowObject) {

        var obj_check_null = [];
        var obj_group = [];
        var dem = 0;

        for(var x in rowObject) {

            var str = rowObject[x]['Date & Time'];
            var sub_str = str.substring(11, 13); // 
            var check_date = parseInt(sub_str);

            // Chỉ lấy những bản ghi có các trường không bỏ trống
            if (rowObject[x]['Name'] && rowObject[x]['Company'] && rowObject[x]['Card No']) {
                // Chỉ lấy những bản ghi trong khoảng từ 11h đến 15h
                if (check_date >= 11 && check_date <= 15) {
                    // console.log(rowObject[x], "hello xxx");
                    obj_check_null.push(rowObject[x]);
                    dem++;
                }
            }
        }
        console.log(dem, obj_check_null);



        // Thêm dữ liệu vào datatable
        // table.rows.add(obj_check_null); // Add new data
        // table.columns.adjust().draw(); // Redraw the DataTable



        var insert_html = '';
        var button_id = 1;

        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        var groubedByTeam = groupBy(obj_check_null, 'Company');

        console.log("Phân chia theo mục Company:");
        console.log("");
        console.log(groubedByTeam);
        console.log(typeof(groubedByTeam));

        // Vòng lặp đọc mảng json khi có key
        for(var k in groubedByTeam) {
            // console.log(k, groubedByTeam[k].length);
            // console.log(groubedByTeam[k], "hello");

            const key = 'Name';
            var arrayUniqueByKey = [...new Map(groubedByTeam[k].map(item =>
                [item[key], item])).values()];

            console.log("key nè: "+k, arrayUniqueByKey);
            obj_group.push(arrayUniqueByKey);

            button_id++;
        }
        // console.log("Dữ liệu chính:", obj_group);

        // Thay thế dữ liệu mới lấy được (XL_row_object) truyền vào datatable (báo cáo 1)
        /*datatable.clear().draw();
        datatable.rows.add(obj); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable*/
        
    }
/* ===== Cuối: Phần chức năng đọc file excel ===== */