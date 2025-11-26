"use client"

export default function Test() {

    function handleCookies() {
        console.log("cookies")
    }


  return (
    <div className="space-y-4">
  <div  className="flex items-center space-x-2">
    <input onChange={handleCookies}
      id="lactose"
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      
    />
    <label htmlFor="lactose" className="text-sm font-medium text-gray-200">
      Lactose intolerant
    </label>
  </div>

  <div  className="flex items-center space-x-2">
    <input
      id="vegetarian"
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor="vegetarian" className="text-sm font-medium text-gray-200">
      Vegetarian
    </label>
  </div>
</div>

  );
}
