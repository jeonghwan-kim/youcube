// toString Override
Date.prototype.toString = function() {
    return (this.getMonth() + 1) + "/" + this.getDate() + "/" + this.getFullYear();
}
