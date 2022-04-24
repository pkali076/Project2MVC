const helper = require('./helper.js');

const handleBlog = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#blogName').value;
    const text = e.target.querySelector('#blogText').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !text){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, text, _csrf}, loadBlogsFromServer);

    return false;
}



const BlogForm = (props) => {
    return(
        <form id="blogForm"
            onSubmit={handleBlog}
            name="blogForm"
            action="/maker"
            method="POST"
            className="blogForm"
            >
                <label htmlFor="name">Blog Name: </label>
                <input id="blogName" type="text" name="name" placeholder="Blog Name" />
                <label htmlFor="text">Blog Text: </label>
                <input id="blogText" type="text" name="text" />
                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeBlogSubmit" type="submit" value="Make Blog" />
            </form>
    );
}

const BlogList = (props) => {
    if(props.blog.length === 0){
        return (
            <div className="blogList">
                <h3 className="emptyBlog">No Blogs Yet!</h3>
            </div>
        );
    }
    
    const blogNodes = props.blog.map(blog => {
        return(
            <div key={blog._id} className="blog">
                <img src="/assets/img/blog.png" alt="blog alt" className="blogFace" />
                <h3 className="blogName"> Name: {blog.name} </h3>
                <h3 className="blogText"> Blog Text: {blog.text} </h3>
            </div>
        );
    });

    return(
        <div className="blogList">
            {blogNodes}
            </div>
    );
}

const loadBlogsFromServer = async () => {
    const response = await fetch('/getBlogs');
    const data = await response.json();
    ReactDOM.render(
        <BlogList blogs={data.blogs} />,
        document.getElementById('blogs')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <BlogForm csrf={data.csrfToken} />,
        document.getElementById('makeBlog')
    );

    ReactDOM.render(
        <BlogList blogs={[]} />,
        document.getElementById('blogs')
    );

    loadBlogsFromServer();
}

window.onload = init;