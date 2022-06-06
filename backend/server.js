const express = require('express');
const cors = require('cors');
const fs = require('fs');

const server = express();

server.use(cors())
server.use(express.json())

server.get('/' , 
    ( req , res )=>{
        res.end('vanakam');
    }
)


const db = JSON.parse(fs.readFileSync('database/posts-db.json' ))

console.log(db[0]);

server.post('/get-posts' ,
    (req, res)=>{
        console.log('get-posts request got!!!');
        fs.readFile('database/posts-db.json' , 
            (err , data)=>{
                let posts = JSON.parse(data);
                res.send(posts);
                res.end();
            } 
        )
    }
)

server.post('/add-post',
    (req , res)=>{
        const post = req.body;
        fs.readFile('database/posts-db.json' , 
            (err , data)=>{
                if(err)console.log(err)
                else{
                    let posts = JSON.parse(data);
                    let len = Object.keys(posts).length;
                    posts.push(
                        {
                            number : len,
                            content : post.content,
                            comments : [
                                {
                                    comment : "First-comment-in-first-post"
                                }
                            ]   
                        }
                    )
                    fs.writeFile('database/posts-db.json' , JSON.stringify(posts) ,
                        (err)=>{
                            if(err)console.log(err);
                            else{
                                fs.readFile('database/posts-db.json' , 
                                    (err , data)=>{
                                        res.send(JSON.parse(data))
                                        res.end()
                                    }
                                )   
                            }
                        }
                    );
                    
                }
            }
        )
    }
)


// {
//     "number" : 0 ,
//     "content" : "First-post-Gravity",
//     "comments" : [
//         {
//             "comment" : "First-comment-in-first-post"
//         }
//     ]
// },

server.post('/add-comment' , 
    (req , res)=>{
        console.log('add-comment request got!!!')
        let comment = req.body;
        fs.readFile('database/posts-db.json' , 
            (err , data)=>{
                let posts = JSON.parse(data);
                let ind = comment.number;
                let arr = posts[ind].comments.concat({ comment : comment.comment });
                posts[ind].comments.push({ comment : comment.comment });
                fs.writeFile('database/posts-db.json' , JSON.stringify(posts) ,
                    (err)=>{
                        if(err)console.log(err);
                        else{
                            fs.readFile('database/posts-db.json' , 
                                    (err , data)=>{
                                    let response = JSON.parse(data)
                                    res.send({ comments : response[ind].comments })
                                    res.end()
                                }
                            )
                        }
                    }
                )

            }
        )
    }
)

server.listen(5000 , ()=>console.log('server started at port:5000'));
